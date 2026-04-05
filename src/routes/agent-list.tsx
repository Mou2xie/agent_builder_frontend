import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";
import { AgentCard } from "../components/AgentCard";

import { Plus } from 'lucide-react';
import { Settings } from 'lucide-react';


export const AgentListPage = () => {

    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    if (!user) {
        navigate("/login");
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["agents"],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from("agents").select("id,name,job_description,status");
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    })

    const mutation = useMutation({
        mutationFn: async () => {
            const { data, error } = await supabaseClient.from("agents").insert({ name: "New Agent", user_id: user?.id }).select("id").single();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            navigate(`/dashboard/agent/${data.id}/personnel`);
        }
    });


    return (
        <>
            <nav className=" h-16 bg-background border-b border-gray-200 flex items-center px-20 sticky top-0 z-10">
                <h2 className=" font-heading text-xl font-extrabold text-primary">Agent Builder</h2>
                <div className="ml-auto flex items-center">
                    {
                        user && (<p className=" text-gray-400 text-sm select-none">{user.email}</p>)
                    }
                    <Settings className=" text-gray-400 ml-5 cursor-pointer hover:text-gray-600 transition-colors duration-200" />
                </div>
            </nav>
            <main className=" max-w-6xl mx-auto">
                <section className=" flex items-center my-10">
                    <h2 className=" text-3xl text-primary font-semibold">Agents</h2>
                    <button className=" ml-auto px-3 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-1 cursor-pointer"
                        onClick={() => mutation.mutate()}>
                        {
                            mutation.isPending ? "Creating..." : <>
                                <Plus size={20} /><span>Create Agent</span>
                            </>
                        }
                    </button>
                </section>
                {isLoading && <p className=" text-gray-400 text-center mt-30">Loading...</p>}
                {isError && <p className=" text-red-500 text-center mt-30">Error: {error.message}</p>}
                <section className=" grid grid-cols-3 gap-5 mb-20">
                    {
                        data && data.map((agent) => (
                            <AgentCard key={agent.id} {...agent} ></AgentCard>
                        ))
                    }
                </section>
            </main >
        </>
    )
}
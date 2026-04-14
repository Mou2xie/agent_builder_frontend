import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";
import { AgentCard } from "../components/AgentCard";

import { Plus, Settings, LogOut } from 'lucide-react';


export const AgentListPage = () => {

    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        setUser(null);
        navigate("/");
    };

    if (!user) {
        navigate("/login");
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["agent-list"],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from("agents").select("id,name,personnel,job_description,status,avatar_url");
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    })

    const mutation = useMutation({
        mutationFn: async () => {
            const { data, error } = await supabaseClient.from("agents")
                .insert({
                    user_id: user?.id,
                    name: "New Agent",
                    status: "STANDBY",
                    theme_color:"#3B82F6",
                    welcome_message:"Hello, nice to meet you! How can I assist you today?",
                    tone:"casual",
                    personnel:"I am a helpful assistant.",
                    job_description:"Assist users with their tasks and answer their questions.",
                    goals:" Provide accurate and helpful information to users."
                })
                .select("id")
                .single();

            if (error) {
                throw new Error(error.message);
            }
            return data;
        },

        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["agent-list"] });
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
                    <div className="relative ml-5" ref={menuRef}>
                        <Settings
                            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                            onClick={() => setMenuOpen((prev) => !prev)}
                        />
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                                <button
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={16} />
                                    <span>Log out</span>
                                </button>
                            </div>
                        )}
                    </div>
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
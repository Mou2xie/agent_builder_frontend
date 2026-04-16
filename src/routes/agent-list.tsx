import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate, NavLink } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";
import { AgentCard } from "../components/AgentCard";
import logo from "../assets/logo.svg";

import { Plus, Settings, LogOut, Bot } from 'lucide-react';

const defaultAvatars = [
    "/default-avatars/shamshad.png",
    "/default-avatars/xie.png",
    "/default-avatars/lu.png",
    "/default-avatars/sam.png",
    "/default-avatars/anton.png",
];
const randomAvatar = () => defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];


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
            const { data, error } = await supabaseClient.from("agents").select("id,name,personnel,job_description,status,avatar_url").eq("user_id", user?.id);
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (agentId: string) => {
            const { error } = await supabaseClient.from("agents").delete().eq("id", agentId);
            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agent-list"] });
        }
    });

    const mutation = useMutation({
        mutationFn: async () => {
            const { data, error } = await supabaseClient.from("agents")
                .insert({
                    user_id: user?.id,
                    name: "New Agent",
                    status: "STANDBY",
                    avatar_url: randomAvatar(),
                    theme_color: "#3B82F6",
                    welcome_message: "Hello, nice to meet you! How can I assist you today?",
                    tone: "casual",
                    personnel: "I am a helpful assistant.",
                    job_description: "Assist users with their tasks and answer their questions.",
                    goals: " Provide accurate and helpful information to users."
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
            <Helmet><title>Agents - NovaAgent</title></Helmet>
            <nav className=" h-16 bg-background-card border-b border-border-light flex items-center px-20 sticky top-0 z-10">

                <NavLink to="/" className="flex items-center gap-2">
                    <img src={logo} alt="NovaAgent logo" className=" w-10 h-10" />
                    <h2 className="font-heading text-2xl font-extrabold text-text-main">NovaAgent</h2>
                </NavLink>

                <div className="ml-auto flex items-center">
                    {
                        user && (<p className=" text-text-muted text-sm select-none">{user.email}</p>)
                    }
                    <div className="relative ml-5" ref={menuRef}>
                        <Settings
                            className="text-text-muted cursor-pointer hover:text-text-secondary transition-colors duration-200"
                            onClick={() => setMenuOpen((prev) => !prev)}
                        />
                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-36 bg-background-card border border-border-light rounded-md shadow-float z-20">
                                <button
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-primary-light cursor-pointer"
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
                    <h2 className=" text-3xl text-text-main font-semibold">Agents</h2>
                    <button className=" ml-auto px-3 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-1 cursor-pointer"
                        onClick={() => mutation.mutate()}>
                        {
                            mutation.isPending ? "Creating..." : <>
                                <Plus size={20} /><span>Create Agent</span>
                            </>
                        }
                    </button>
                </section>
                {isLoading && <p className=" text-text-muted text-center mt-30">Loading...</p>}
                {isError && <p className=" text-red-500 text-center mt-30">Error: {error.message}</p>}
                {!isLoading && !isError && data?.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-30">
                        <Bot size={48} className="text-text-muted mb-4" />
                        <p className="text-text-muted text-lg mb-2">No agents yet</p>
                        <p className="text-text-muted text-sm mb-6">Create your first agent to get started.</p>
                        <button
                            className="px-4 py-2 border border-primary rounded-md text-primary hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer"
                            onClick={() => mutation.mutate()}
                        >
                            {mutation.isPending ? "Creating..." : <><span>Create Agent</span></>}
                        </button>
                    </div>
                )}
                {data && data.length > 0 && (
                    <section className=" grid grid-cols-3 gap-5 mb-20">
                        {data.map((agent) => (
                            <AgentCard key={agent.id} {...agent} onDelete={(id) => deleteMutation.mutate(id)}></AgentCard>
                        ))}
                    </section>
                )}
            </main >
        </>
    )
}
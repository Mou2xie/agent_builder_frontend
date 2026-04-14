import { useParams, useNavigate } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";
import { Settings, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Modal } from "./Modal";

type AgentStatus = "STANDBY" | "ONLINE";

// used in dashboard pages
export const Topbar = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [menuOpen, setMenuOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const handleDelete = async () => {
        if (!id) return;
        setConfirmOpen(false);
        const { error } = await supabaseClient.from('agents').delete().eq('id', id);
        if (error) return;
        queryClient.invalidateQueries({ queryKey: ['agents'] });
        navigate('/dashboard');
    };

    const query = useQuery({
        queryKey: ["topbar", id],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from("agents").select("id,name,avatar_url,status").eq("id", id).single();
            if (error) {
                throw new Error(error.message);
            }
            return data as { id: string; name: string; avatar_url: string | null; status: AgentStatus };
        }
    })

    const statusMutation = useMutation({
        mutationFn: async (status: AgentStatus) => {
            const { error } = await supabaseClient.from("agents").update({ status }).eq("id", id).select("id").single();
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["topbar", id] });
        }
    });

    const currentStatus = query.data?.status ?? "STANDBY";
    const isOnline = currentStatus === "ONLINE";

    return (
        <nav className=" h-16 bg-background-card border-b border-border-light flex items-center px-20">
            {query.data?.avatar_url ? (
                <img src={supabaseClient.storage.from('avatar').getPublicUrl(query.data.avatar_url).data.publicUrl} alt="Agent Avatar" className=" w-11 h-11 rounded-lg object-cover" />
            ) : (
                <div className="w-11 h-11 rounded-lg bg-primary-light border border-border-light" />
            )}
            <div className=" flex flex-col ml-4">
                <h2 className=" font-heading text-xl font-extrabold text-text-main ">
                    {
                        query.data && query.data.name
                    }
                </h2>
                <p className="text-[12px] text-text-muted">ID: {query.data && query.data.id}</p>

            </div>
            <div className="ml-auto flex items-center gap-3">
                <button
                    onClick={() => setStatusConfirmOpen(true)}
                    disabled={statusMutation.isPending}
                    className={`h-9 px-4 text-sm rounded-lg font-medium transition-colors duration-200 cursor-pointer ${isOnline ? "bg-primary text-white" : "bg-primary-light text-primary"} ${statusMutation.isPending ? "opacity-50 cursor-not-allowed" : "hover:opacity-85"}`}
                >
                    {statusMutation.isPending ? "..." : currentStatus}
                </button>
                <div ref={menuRef} className="relative">
                    <div onClick={() => setMenuOpen(v => !v)} className="w-9 h-9 flex items-center justify-center border-2 border-primary rounded-lg group hover:bg-primary transition-colors duration-200 cursor-pointer">
                        <Settings className="text-primary group-hover:text-white transition-colors duration-200" />
                    </div>
                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-background-card border border-border-light rounded-lg shadow-float py-1 z-50">
                            <button onClick={() => { setMenuOpen(false); setConfirmOpen(true); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer">
                                <Trash2 size={16} />
                                Delete Agent
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Agent">
                <p className="text-text-secondary mb-6">Are you sure you want to delete this agent? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 text-sm text-text-secondary rounded-lg hover:bg-primary-light transition-colors duration-200 cursor-pointer">Cancel</button>
                    <button onClick={() => void handleDelete()} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 cursor-pointer">Delete</button>
                </div>
            </Modal>
            <Modal open={statusConfirmOpen} onClose={() => setStatusConfirmOpen(false)} title={isOnline ? "Switch to Standby" : "Switch to Online"}>
                <p className="text-text-secondary mb-6">{isOnline ? "Are you sure you want to set this agent to Standby? It will stop responding to users." : "Are you sure you want to set this agent to Online? It will start responding to users."}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setStatusConfirmOpen(false)} className="px-4 py-2 text-sm text-text-secondary rounded-lg hover:bg-primary-light transition-colors duration-200 cursor-pointer">Cancel</button>
                    <button onClick={() => { setStatusConfirmOpen(false); statusMutation.mutate(isOnline ? "STANDBY" : "ONLINE"); }} className="px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors duration-200 cursor-pointer">Confirm</button>
                </div>
            </Modal>
        </nav>
    )

}
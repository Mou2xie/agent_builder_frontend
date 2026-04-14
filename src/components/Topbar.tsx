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
        <nav className=" h-16 bg-background border-b border-gray-200 flex items-center px-20">
            {query.data?.avatar_url ? (
                <img src={supabaseClient.storage.from('avatar').getPublicUrl(query.data.avatar_url).data.publicUrl} alt="Agent Avatar" className=" w-11 h-11 rounded-lg object-cover" />
            ) : (
                <div className="w-11 h-11 rounded-lg bg-gray-100 border border-gray-200" />
            )}
            <div className=" flex flex-col ml-4">
                <h2 className=" font-heading text-xl font-extrabold text-primary ">
                    {
                        query.data && query.data.name
                    }
                </h2>
                <p className="text-[12px] text-gray-400">ID: {query.data && query.data.id}</p>

            </div>
            <button
                onClick={() => statusMutation.mutate(isOnline ? "STANDBY" : "ONLINE")}
                disabled={statusMutation.isPending}
                className={`ml-auto px-3 py-2 text-sm rounded-sm transition-opacity duration-200 cursor-pointer ${isOnline ? " border-2 border-primary text-primary " : "bg-gray-300 text-gray-700"} ${statusMutation.isPending ? "opacity-50 cursor-not-allowed" : "hover:opacity-85"}`}
            >
                {statusMutation.isPending ? "..." : currentStatus}
            </button>
            <button onClick={() => navigate(`/dashboard/agent/${id}/share`)} className="ml-4 px-3 py-2 text-sm bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 cursor-pointer">Share</button>
            <div ref={menuRef} className="relative ml-4">
                <div onClick={() => setMenuOpen(v => !v)} className=" border-2 border-primary p-1 rounded-md group hover:bg-primary transition-colors duration-200 cursor-pointer">
                    <Settings className="text-primary group-hover:text-white transition-colors duration-200" />
                </div>
                {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                        <button onClick={() => { setMenuOpen(false); setConfirmOpen(true); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer">
                            <Trash2 size={16} />
                            Delete Agent
                        </button>
                    </div>
                )}
            </div>
            <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Agent">
                <p className="text-gray-600 mb-6">Are you sure you want to delete this agent? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">Cancel</button>
                    <button onClick={() => void handleDelete()} className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 cursor-pointer">Delete</button>
                </div>
            </Modal>
        </nav>
    )

}
import { useState } from "react";

import { Settings, Share2, Trash2 } from 'lucide-react';
import { supabaseClient } from "../libs/supabaseClient";
import defaultAvatar from "../assets/yong.png"

interface AgentCardProps {
    id: string;
    name: string;
    personnel: string;
    job_description: string;
    status: string;
    avatar_url?: string | null;
    onDelete?: (id: string) => void;
}

export const AgentCard = ({ id, name, personnel, job_description, status, avatar_url, onDelete }: AgentCardProps) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const avatarSrc = avatar_url
        ? supabaseClient.storage.from('avatar').getPublicUrl(avatar_url).data.publicUrl
        : defaultAvatar;

    return (
        <div key={id} className=" bg-background-card shadow-card-soft rounded-xl px-8 pt-8">
            <section className=" flex justify-between items-start">
                <img src={avatarSrc} alt="Agent Avatar" className=" w-18 h-18 rounded-lg object-cover" />
                <div className={` px-3 py-1 rounded-full text-[12px] font-medium ${status === "ONLINE" ? "bg-primary text-white" : "bg-primary-light text-text-muted"}`}>
                    {status}
                </div>
            </section>
            <p className="text-xl font-semibold text-text-main mt-6">{name}</p>
            <p className=" text-text-secondary text-sm clamp-1-fixed mb-3">{personnel}</p>
            <p className="text-text-muted text-sm clamp-2-fixed mb-6">{job_description}</p>
            <div className=" flex items-center gap-5 py-5 border-t border-border-divider">
                <Settings size={22} className=" text-text-muted cursor-pointer hover:text-text-secondary transition-colors duration-200"
                    onClick={() => window.open(`/dashboard/agent/${id}/personnel`, '_blank')} />
                <Share2 size={22} className=" text-text-muted cursor-pointer hover:text-text-secondary transition-colors duration-200"
                    onClick={() => window.open(`/dashboard/agent/${id}/share`, '_blank')} />
                <Trash2 size={22} className=" ml-auto text-text-muted cursor-pointer hover:text-red-400 transition-colors duration-200"
                    onClick={() => setConfirmOpen(true)} />
            </div>

            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmOpen(false)}>
                    <div className="bg-background-card rounded-xl shadow-float p-6 w-80" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-primary">Delete Agent</h3>
                        <p className="text-sm text-text-muted mt-2">Are you sure you want to delete <span className="font-medium text-text-main">{name}</span>? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button className="px-4 py-2 text-sm text-text-secondary bg-primary-light rounded-lg hover:bg-primary-light/80 cursor-pointer" onClick={() => setConfirmOpen(false)}>Cancel</button>
                            <button className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 cursor-pointer" onClick={() => { setConfirmOpen(false); onDelete?.(id); }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}
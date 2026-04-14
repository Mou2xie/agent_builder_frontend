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
        <div key={id} className=" bg-white shadow shadow-gray-200 rounded-xl px-8 pt-8">
            <section className=" flex justify-between items-start">
                <img src={avatarSrc} alt="Agent Avatar" className=" w-18 h-18 rounded-lg object-cover" />
                <div className={` px-3 py-1 rounded-full bg-gray-100 text-[12px] font-medium ${status === "ONLINE" ? "text-primary" : "text-gray-400"}`}>
                    {status}
                </div>
            </section>
            <p className="text-xl font-semibold text-primary mt-6">{name}</p>
            <p className=" text-gray-600 text-sm clamp-1-fixed mb-3">{personnel}</p>
            <p className="text-gray-400 text-sm clamp-2-fixed mb-6">{job_description}</p>
            <div className=" flex items-center gap-5 py-5 border-t border-gray-100">
                <Settings size={22} className=" text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                    onClick={() => window.open(`/dashboard/agent/${id}/personnel`, '_blank')} />
                <Share2 size={22} className=" text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                    onClick={() => window.open(`/dashboard/agent/${id}/share`, '_blank')} />
                <Trash2 size={22} className=" ml-auto text-gray-400 cursor-pointer hover:text-red-400 transition-colors duration-200"
                    onClick={() => setConfirmOpen(true)} />
            </div>

            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmOpen(false)}>
                    <div className="bg-white rounded-lg shadow-xl p-6 w-80" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-primary">Delete Agent</h3>
                        <p className="text-sm text-gray-500 mt-2">Are you sure you want to delete <span className="font-medium text-gray-700">{name}</span>? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer" onClick={() => setConfirmOpen(false)}>Cancel</button>
                            <button className="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 cursor-pointer" onClick={() => { setConfirmOpen(false); onDelete?.(id); }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

}
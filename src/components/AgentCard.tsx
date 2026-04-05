import { useNavigate } from "react-router";

import { Settings } from 'lucide-react';
import { Share2 } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import avatar from "../assets/yong.png"

interface AgentCardProps {
    id: string;
    name: string;
    job_description: string;
    status: string;
}

export const AgentCard = ({ id, name, job_description, status }: AgentCardProps) => {
    const navigate = useNavigate();
    return (
        <div key={id} className=" bg-white shadow shadow-gray-200 rounded-xl px-8 pt-8">
            <section className=" flex justify-between items-start">
                <img src={avatar} alt="Agent Avatar" className=" w-18 h-18 rounded-lg" />
                <div className={` px-3 py-1 bg-gray-100 rounded-full text-[12px] ${status === "WORKING" ? "text-gray-500" : "text-gray-400"}`}>
                    {status}
                </div>
            </section>
            <p className="text-xl font-semibold text-primary mt-6">{name}</p>
            <p className="text-gray-400 text-sm clamp-2-fixed mt-1 mb-6">{job_description}</p>
            <div className=" flex items-center gap-5 py-5 border-t border-gray-100">
                <Settings size={22} className=" text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                    onClick={() => navigate(`/dashboard/agent/${id}/personnel`)} />
                <Share2 size={22} className=" text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
                    onClick={() => navigate(`/dashboard/agent/${id}/share`)} />
                <Trash2 size={22} className=" ml-auto text-gray-400 cursor-pointer hover:text-red-400 transition-colors duration-200" />
            </div>
        </div>
    )

}
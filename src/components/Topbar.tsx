import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";
import avatar from "../assets/yong.png";
import { Settings } from "lucide-react";

// used in dashboard pages
export const Topbar = () => {

    const { id } = useParams();

    const query = useQuery({
        queryKey: ["topbar", id],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from("agents").select("id,name").eq("id", id).single();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    })

    return (
        <nav className=" h-16 bg-background border-b border-gray-200 flex items-center px-20">
            <img src={avatar} alt="Agent Avatar" className=" w-11 h-11 rounded-lg" />
            <div className=" flex flex-col ml-4">
                <h2 className=" font-heading text-xl font-extrabold text-primary ">
                    {
                        query.data && query.data.name
                    }
                </h2>
                <p className="text-[12px] text-gray-400">ID: {query.data && query.data.id}</p>

            </div>
            <button className="ml-auto px-3 py-2 text-sm bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 cursor-pointer">Share</button>
            <div className=" border-2 border-primary p-1 rounded-md ml-4 group hover:bg-primary transition-colors duration-200 cursor-pointer">
                <Settings className="text-primary group-hover:text-white transition-colors duration-200" />
            </div>
        </nav>
    )

}
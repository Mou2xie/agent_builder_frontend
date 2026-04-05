import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";

// used in dashboard pages
export const Topbar = () => {

    const { id } = useParams();

    const query = useQuery({
        queryKey: ["agent", id],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from("agents").select("name").eq("id", id).single();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        }
    })

    return (
        <nav className=" h-18 bg-primary flex items-center px-20 sticky top-0 z-10">
            <h2 className=" font-heading text-xl font-extrabold text-white">
                {
                    query.data ? query.data.name : "Loading..."
                }
            </h2>
        </nav>
    )

}
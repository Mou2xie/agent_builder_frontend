import avatar from '../assets/yong.png';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { supabaseClient } from '../libs/supabaseClient';

export const Chatbar = () => {

    const { id } = useParams();

    const query = useQuery({
        queryKey: ["chatbar"],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from("agents").select("name").eq("id", id).single();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
    });
    return (
        <nav className=" h-16 bg-background border-b border-gray-200 flex items-center px-20">
            <img src={avatar} alt="Agent Avatar" className=" w-11 h-11 rounded-lg" />
            <h2 className=" font-heading text-xl font-extrabold text-primary ml-4 ">
                {
                    query.data && query.data.name
                }
            </h2>
        </nav>
    )
}
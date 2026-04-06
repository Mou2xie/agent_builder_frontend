import { useParams } from "react-router"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabaseClient } from "../libs/supabaseClient";

export const AppearancePage = () => {

    const { id } = useParams();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['agent-appearance', id],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from('agents')
                .select('id,theme_color,welcome_message,tone')
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(error.message);
            }
            
            setFormData({
                themeColour: data?.theme_color ?? "",
                welcomeMessage: data?.welcome_message ?? "",
                tone: data?.tone ?? "",
            });

            return data;
          }
    });

    const mutation = useMutation({
        mutationFn:async () =>{
            const { error } = await supabaseClient.from('agents')
                .update({
                    theme_color: formData.themeColour,
                    welcome_message: formData.welcomeMessage,
                    tone: formData.tone,
                })
                .eq('id', id)
                .select('id')
                .single();
                
            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agent-appearance', id] });
        }
    });

    const [formData, setFormData] = useState({
        themeColour: "",
        welcomeMessage: "",
        tone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    }

    return (
        <div className="grow px-20 py-8 bg-white">
            <h1 className=" text-2xl font-semibold text-primary">Appearance</h1>
            <p className=" text-gray-600 mb-8">Adjust how your agent looks</p>
            <form className=" flex flex-col gap-5 w-1/2" onSubmit={handleSubmit}>
                <div className=" flex justify-between items-center">
                    <label className=" flex flex-col gap-2">
                        <span className=" text-primary text-sm">Theme Colour</span>
                        <input type="text" id="themeColour" name="themeColour" className=" border rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.themeColour} />
                    </label>
                    <div className="w-15 h-15 rounded-full" style={{ backgroundColor: formData.themeColour }}></div>
                </div>

                <label className=" flex flex-col gap-2 ">
                    <span className=" text-primary text-sm">Welcome Message</span>
                    <textarea name="welcomeMessage" id="welcomeMessage" className=" border rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.welcomeMessage}></textarea>
                </label>
                <label className=" flex flex-col gap-2">
                    <span className=" text-primary text-sm">Tone</span>
                    <select name="tone" id="tone" className=" border rounded-lg p-2 focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.tone}>
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="neutral">Neutral</option>
                    </select>
                </label>
                <button type="submit" className=" self-end px-5 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-1 cursor-pointer" onClick={handleSubmit}>
                    {
                        mutation.isPending ? "Saving..." : "Save"
                    }
                </button>
            </form>
        </div>
    )
}
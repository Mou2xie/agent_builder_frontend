import { useParams } from "react-router"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabaseClient } from "../libs/supabaseClient";

export const BehaviorPage = () => {

    const { id } = useParams();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['agent-behavior', id],
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
        mutationFn: async () => {
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
            queryClient.invalidateQueries({ queryKey: ['agent-behavior', id] });
        }
    });

    const [formData, setFormData] = useState({
        themeColour: "",
        welcomeMessage: "",
        tone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            <section className=" flex justify-between items-end gap-20 mb-10">
                <div>
                    <h1 className=" text-3xl font-semibold text-primary">Behavior</h1>
                    <p className=" text-gray-400 mt-1">Adjust how your agent behaves</p>
                </div>
            </section>

            <form className=" flex flex-col gap-5 w-3/5" onSubmit={handleSubmit}>
                {/* <div className=" flex justify-between items-center">
                    <label className=" flex flex-col gap-2">
                        <span className=" text-primary text-sm">Theme Colour</span>
                        <input type="text" id="themeColour" name="themeColour" className=" border border-gray-300 rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.themeColour} />
                    </label>
                    <div className="w-15 h-15 rounded-full" style={{ backgroundColor: formData.themeColour }}></div>
                </div> */}

                <label className=" flex flex-col gap-2 ">
                    <span className=" text-primary text-sm">Welcome Message</span>
                    <textarea name="welcomeMessage" id="welcomeMessage" className=" border border-gray-300 rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.welcomeMessage}></textarea>
                </label>
                <div className="flex flex-col gap-2">
                    <span className=" text-primary text-sm">Tone</span>
                    <div className="flex gap-4">
                        {(["professional", "casual", "neutral"] as const).map((tone) => (
                            <label
                                key={tone}
                                className={`flex-1 rounded-lg px-4 py-3 text-center cursor-pointer transition-all duration-200 ${formData.tone === tone ? "bg-white border-2 border-primary text-primary" : "border border-gray-400 text-gray-400"}`}
                            >
                                <input
                                    type="radio"
                                    name="tone"
                                    value={tone}
                                    checked={formData.tone === tone}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <span className="text-sm font-medium capitalize">{tone}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit" className=" self-end px-5 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-1 cursor-pointer" onClick={handleSubmit}>
                    {
                        mutation.isPending ? "Saving..." : "Save"
                    }
                </button>
            </form>
        </div>
    )
}
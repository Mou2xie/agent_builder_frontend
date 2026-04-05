import { useState } from "react"
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";

export const PersonnelPage = () => {

    const { id } = useParams();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        agentName: "",
        personnel: "",
        jobDescription: "",
        goals: "",
    });

    const query = useQuery({
        queryKey: ['agent', id],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from('agents')
                .select('id,name,personnel,job_description,goals')
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            setFormData({
                agentName: data?.name ?? "",
                personnel: data?.personnel ?? "",
                jobDescription: data?.job_description ?? "",
                goals: data?.goals ?? "",
            });

            return data;
        }
    });

    const mutation = useMutation({
        mutationFn: async () => {
            const { error } = await supabaseClient.from('agents')
                .update({
                    name: formData.agentName,
                    personnel: formData.personnel,
                    job_description: formData.jobDescription,
                    goals: formData.goals,
                })
                .eq('id', id)
                .select('id')
                .single();

            if (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agent', id] });
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    }

    return (
        <div className="grow px-20 py-10 bg-white">
            <h1 className=" text-2xl font-semibold text-primary">Personnel</h1>
            <p className=" text-gray-600 mb-10">Give your agent a basic profile information.</p>
            <form className=" flex flex-col gap-5 w-1/2" onSubmit={handleSubmit}>
                <label className=" flex flex-col gap-2">
                    <span className=" text-primary text-sm">Agent Name</span>
                    <input className=" border rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" type="text" id="agentName" name="agentName" onChange={handleChange} value={formData.agentName} />
                </label>
                <label className=" flex flex-col gap-2">
                    <span className=" text-primary text-sm">Personnel</span>
                    <textarea name="personnel" id="personnel" className=" border rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.personnel}></textarea>
                </label>
                <label className=" flex flex-col gap-2">
                    <span className=" text-primary text-sm">Job Description</span>
                    <textarea name="jobDescription" id="jobDescription" className=" border rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.jobDescription}></textarea>
                </label>
                <label className=" flex flex-col gap-2">
                    <span className=" text-primary text-sm">Goals</span>
                    <textarea name="goals" id="goals" className=" border rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.goals}></textarea>
                </label>
                <button type="submit" className=" self-end px-5 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-1 cursor-pointer">{
                    mutation.isPending ? 'Saving...' : 'Save'
                }</button>
            </form>
            {
                query.isError && <div className=" text-red-500">{(query.error as Error).message}</div>
            }
        </div>
    )
}
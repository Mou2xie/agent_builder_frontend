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

            console.log(data, error);

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
        <div className="grow p-5">
            <h1 className=" my-5">Personnel</h1>
            <form className=" flex flex-col w-1/2" onSubmit={handleSubmit}>
                <label className=" flex flex-col">
                    <span>Agent Name</span>
                    <input type="text" id="agentName" name="agentName" className=" border" onChange={handleChange} value={formData.agentName} />
                </label>
                <label className=" flex flex-col">
                    <span>Personnel</span>
                    <textarea name="personnel" id="personnel" className=" border" onChange={handleChange} value={formData.personnel}></textarea>
                </label>
                <label className=" flex flex-col">
                    <span>Job Description</span>
                    <textarea name="jobDescription" id="jobDescription" className=" border" onChange={handleChange} value={formData.jobDescription}></textarea>
                </label>
                <label className=" flex flex-col">
                    <span>Goals</span>
                    <textarea name="goals" id="goals" className=" border" onChange={handleChange} value={formData.goals}></textarea>
                </label>
                <button type="submit" className=" my-10 w-32 py-1 bg-blue-500">{
                    mutation.isPending ? 'Saving...' : 'Save'
                }</button>
            </form>
            {
                query.isError && <div className=" text-red-500">{(query.error as Error).message}</div>
            }
        </div>
    )
}
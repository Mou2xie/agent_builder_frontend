import { useState, useRef } from "react"
import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";
import { Upload } from 'lucide-react';
import { InfoTip } from "../components/InfoTip";

export const PersonnelPage = () => {

    const { id } = useParams();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        agentName: "",
        personnel: "",
        jobDescription: "",
        goals: "",
    });
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const query = useQuery({
        queryKey: ['agent-personnel', id],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from('agents')
                .select('id,name,personnel,job_description,goals,avatar_url')
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

            if (data?.avatar_url) {
                const { data: urlData } = supabaseClient.storage.from('avatar').getPublicUrl(data.avatar_url);
                setAvatarUrl(urlData.publicUrl);
            } else {
                setAvatarUrl(null);
            }

            return data;
        }
    });

    const avatarUploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const ext = file.name.split('.').pop();
            const filePath = `${id}/avatar.${ext}`;

            const { error: uploadError } = await supabaseClient.storage
                .from('avatar')
                .upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;

            const { data: urlData } = supabaseClient.storage.from('avatar').getPublicUrl(filePath);

            const { error: updateError } = await supabaseClient.from('agents')
                .update({ avatar_url: filePath })
                .eq('id', id);
            if (updateError) throw updateError;

            return urlData.publicUrl;
        },
        onSuccess: (publicUrl) => {
            setAvatarUrl(publicUrl);
            queryClient.invalidateQueries({ queryKey: ['agent-personnel', id] });
            queryClient.invalidateQueries({ queryKey: ['agent-list'] });
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
            queryClient.invalidateQueries({ queryKey: ['agent-personnel', id] });
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

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) return;
        avatarUploadMutation.mutate(file);
        e.target.value = '';
    }

    return (
        <div className="grow px-20 py-8 bg-white">
            <section className=" flex justify-between items-end gap-20 mb-10">
                <div>
                    <h1 className=" text-3xl font-semibold text-primary">Personnel</h1>
                    <p className=" text-gray-400 mt-1">Create your agent's profile, make it a real worker — name it, describe its job, and set what it should aim for.</p>
                </div>
            </section>

            <div className="flex gap-20">
                <form className="flex flex-col gap-5 w-3/5" onSubmit={handleSubmit}>
                    <label className=" flex flex-col gap-2">
                    <span className=" text-primary text-sm">Agent Name</span>
                    <input className=" border border-gray-300 rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" type="text" id="agentName" name="agentName" onChange={handleChange} value={formData.agentName} />
                </label>
                <label className=" flex flex-col gap-2">
                    <InfoTip content={<span>Describe the type of role your agent plays, like "Customer Support Agent" or "Data Analyst". This helps define its personality and approach.</span>}>
                        <span className=" text-primary text-sm">Personnel</span>
                    </InfoTip>
                    <textarea name="personnel" id="personnel" className=" border border-gray-300 rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.personnel}></textarea>
                </label>
                <label className=" flex flex-col gap-2">
                    <InfoTip content={<span>Explain what your agent does in detail. What tasks does it handle? What kind of questions can it answer? The more specific, the better.</span>}>
                        <span className=" text-primary text-sm">Job Description</span>
                    </InfoTip>
                    <textarea name="jobDescription" id="jobDescription" className=" border border-gray-300 rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.jobDescription}></textarea>
                </label>
                <label className=" flex flex-col gap-2">
                    <InfoTip content={<span>What should your agent aim to achieve? For example: "Resolve customer issues" or "Help customers to make purchases decisions".</span>}>
                        <span className=" text-primary text-sm">Goals</span>
                    </InfoTip>
                    <textarea name="goals" id="goals" className=" border border-gray-300 rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" onChange={handleChange} value={formData.goals}></textarea>
                </label>
                <button type="submit" className=" self-end px-5 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-1 cursor-pointer">{
                    mutation.isPending ? 'Saving...' : 'Save'
                }</button>
            </form>
            <div className="flex flex-col items-center gap-4 pt-2">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Agent Avatar"
                        className="w-40 h-40 rounded-lg object-cover border border-gray-200"
                    />
                ) : (
                    <div className="w-40 h-40 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No Avatar</div>
                )}
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".png,.jpg,.jpeg,.svg"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                    <button
                        type="button"
                        className="px-3 py-2 text-sm text-primary border border-primary rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={16} />
                        {avatarUploadMutation.isPending ? 'Uploading...' : 'Upload Avatar'}
                    </button>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, or SVG allowed</p>
                </div>
            </div>
            </div>
            {
                query.isError && <div className=" text-red-500">{(query.error as Error).message}</div>
            }
            {
                avatarUploadMutation.isError && <div className=" text-red-500">{(avatarUploadMutation.error as Error).message}</div>
            }
        </div>
    )
}
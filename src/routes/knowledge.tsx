import { useParams } from "react-router";
import { supabaseClient } from "../libs/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore";
import { useState } from "react";

import { Upload, File, Trash2, Loader2, CheckCircle, AlertCircle, RotateCcw } from "lucide-react";

export const KnowledgePage = () => {
  const { id } = useParams();
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();

  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>({});

  const query = useQuery({
    queryKey: ["files", id],
    queryFn: async () => {
      const { data, error } = await supabaseClient.storage
        .from("files")
        .list(`${id}`, { limit: 100 });
      if (error) throw error;
      return data ?? [];
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const rawFileName = `${Date.now()}-${file.name}`;
      const filePath = `${id}/${rawFileName}`;

      const { error } = await supabaseClient.storage
        .from("files")
        .upload(filePath, file);
      if (error) throw error;

      // get task_id from gag service
      const res = await fetch(`${import.meta.env.VITE_GAG_SERVICE_URL}/${id}/${rawFileName}/${user?.id}`, {
        method: "POST",
        headers: {
          "X-API-Key": import.meta.env.VITE_SERVICE_API_KEY
        }
      });

      if (!res.ok) throw new Error("Failed to trigger vectorization");
      const { task_id } = await res.json();

      return { taskId: task_id, fileName: rawFileName };
    },
    onSuccess: ({ taskId, fileName }) => {
      queryClient.invalidateQueries({ queryKey: ["files", id] });

      // keep track of the task status
      subscribeToTask(taskId, fileName);
    },
  });

  const subscribeToTask = (taskId: string, fileName: string) => {

    setTaskStatuses(prev => ({ ...prev, [fileName]: 'pending' }));

    const channel = supabaseClient
      .channel(`task-monitor-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'document_tasks',
          filter: `id=eq.${taskId}`
        },
        (payload) => {
          const newStatus = payload.new.status;
          setTaskStatuses(prev => ({ ...prev, [fileName]: newStatus }));
          // If the task is completed or failed, stop listening
          if (newStatus === 'completed' || newStatus === 'failed') {
            supabaseClient.removeChannel(channel);
          }
        }
      )
      .subscribe();
  };

  const retryMutation = useMutation({
    mutationFn: async (fileName: string) => {
      const res = await fetch(`${import.meta.env.VITE_GAG_SERVICE_URL}/${id}/${fileName}/${user?.id}`, {
        method: "POST",
        headers: {
          "X-API-Key": import.meta.env.VITE_SERVICE_API_KEY
        }
      });
      if (!res.ok) throw new Error("Failed to trigger vectorization");
      const { task_id } = await res.json();
      return { taskId: task_id, fileName };
    },
    onSuccess: ({ taskId, fileName }) => {
      subscribeToTask(taskId, fileName);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileName: string) => {
      const { error } = await supabaseClient.storage
        .from("files")
        .remove([`${id}/${fileName}`]);
      if (error) throw error;

      const res = await supabaseClient.from("documents")
        .delete()
        .eq("agent_id", id)
        .eq("file_name", fileName);
      if (res.error) throw res.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", id] });
    },
  });

  const fileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file);
    e.target.value = '';
  };

  return (
    <div className="grow px-20 py-8 bg-white">
      <h1 className="text-2xl font-semibold text-primary">Knowledge</h1>
      <p className="text-gray-600">
        Manage your agent's knowledge base.
      </p>

      <section className="mb-5">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.txt,.docx"
          onChange={fileUploadHandler}
          disabled={uploadMutation.isPending}
        />
        <label
          htmlFor="file-upload"
          className={`ml-auto px-5 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-2 cursor-pointer w-fit ${uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploadMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          {uploadMutation.isPending ? "Uploading..." : "Upload File"}
        </label>
      </section>

      <section className="border border-gray-300 rounded-xl">
        <ul>
          {query.isLoading && (
            <li className="p-5 text-gray-400 text-center">Loading...</li>
          )}

          {!query.isLoading && query.data?.length === 0 && (
            <li className="p-5 text-gray-400 text-center">No files yet</li>
          )}

          {query.data?.map((file) => {
            const currentStatus = taskStatuses[file.name];

            return (
              <li
                key={file.name}
                className="p-5 border-b border-gray-200 last:border-0 flex items-center gap-3"
              >
                <File className="text-primary" size={20} />
                <span className="text-primary truncate max-w-75" title={file.name}>
                  {file.name.split("-").slice(1).join("-")}
                </span>

                <div className="ml-5 flex items-center text-sm">
                  {(currentStatus === 'pending' || currentStatus === 'processing') && <span className="text-gray-500 flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Vectorizing...</span>}
                  {currentStatus === 'completed' && <span className="text-green-500 flex items-center gap-1"><CheckCircle size={14} /> Ready</span>}
                  {currentStatus === 'failed' && <span className="text-red-500 flex items-center gap-1"><AlertCircle size={14} /> Failed</span>}
                  {currentStatus === 'failed' && (
                    <button
                      className="ml-1 text-red-400 hover:text-red-600 transition-colors duration-200 disabled:opacity-50"
                      onClick={() => retryMutation.mutate(file.name)}
                      disabled={retryMutation.isPending}
                      title="Retry vectorization"
                    >
                      {retryMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                    </button>
                  )}
                </div>

                <span className="ml-auto text-gray-400 shrink-0">
                  {(() => {
                    const timestamp = Number(file.name.split("-")[0]);
                    if (!Number.isFinite(timestamp)) return "";

                    const uploadTime = new Date(timestamp);
                    if (Number.isNaN(uploadTime.getTime())) return "";

                    return uploadTime.toLocaleString("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  })()}
                </span>

                <Trash2
                  size={20}
                  className=" ml-5 text-gray-400 cursor-pointer hover:text-red-400 transition-colors duration-200 shrink-0"
                  onClick={() => deleteMutation.mutate(file.name)}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};
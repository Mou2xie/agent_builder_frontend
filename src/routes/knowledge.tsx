import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
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

      // get task_id from rag service
      const res = await fetch(`/api/rag/${id}/${rawFileName}/${user?.id}`, {
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
      const res = await fetch(`/api/rag/${id}/${fileName}/${user?.id}`, {
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
    <div className="grow px-20 py-8 bg-background-card">
      <Helmet><title>Knowledge Base - NovaAgent</title></Helmet>
      <section className=" flex justify-between items-end gap-20 mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-text-main">Knowledge Base</h1>
          <p className="text-text-muted mt-1">
            Teach your agent by uploading documents. Your agent will use what it learns to respond more accurately to questions.
          </p>
        </div>
        <section className=" shrink-0">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.txt,.docx,.md,.markdown"
            onChange={fileUploadHandler}
            disabled={uploadMutation.isPending}
          />
          <div className="ml-auto w-fit">
            <label
              htmlFor="file-upload"
              className={`px-5 py-2 bg-primary text-white rounded-lg hover:opacity-85 transition-opacity duration-200 flex items-center gap-3 cursor-pointer w-fit ${uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploadMutation.isPending ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
              <span>
                <p>{uploadMutation.isPending ? "Uploading..." : "Upload Document"}</p>
                <p className="text-[10px]">PDF, DOCX, TXT, MD</p>
              </span>
            </label>
          </div>
        </section>
      </section>
      {uploadMutation.isError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          <span>Upload failed: {uploadMutation.error instanceof Error ? uploadMutation.error.message : "Unknown error"}</span>
          <button
            className="ml-auto underline hover:no-underline"
            onClick={() => uploadMutation.reset()}
          >
            Dismiss
          </button>
        </div>
      )}
      {(uploadMutation.isPending || Object.values(taskStatuses).some(s => s === 'pending' || s === 'processing')) && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-sm text-amber-600">
          <Loader2 size={16} className="animate-spin shrink-0" />
          <span>Your document is being uploaded and learned. This may take several minutes depending on the file size. Please wait on this page.</span>
        </div>
      )}

      <section className="border border-border-light rounded-xl">
        <ul>
          {query.isLoading && (
            <li className="p-5 text-text-muted text-center">Loading...</li>
          )}

          {!query.isLoading && query.data?.length === 0 && (
            <li className="p-5 text-text-muted text-center">No files yet</li>
          )}

          {query.data?.map((file) => {
            const currentStatus = taskStatuses[file.name];

            return (
              <li
                key={file.name}
                className="px-5 py-3 border-b border-border-divider last:border-0 flex items-center gap-3"
              >
                <File className="text-primary" size={20} />
                <span className="text-text-secondary truncate max-w-75" title={file.name}>
                  {file.name.split("-").slice(1).join("-")}
                </span>

                <div className="ml-5 flex items-center text-sm">
                  {(currentStatus === 'pending' || currentStatus === 'processing') && <span className="text-text-muted flex items-center gap-1"><Loader2 size={14} className="animate-spin" /> Vectorizing...</span>}
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

                <span className="ml-auto text-text-muted shrink-0">
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
                  className=" ml-5 text-text-muted cursor-pointer hover:text-red-400 transition-colors duration-200 shrink-0"
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
import { useParams } from "react-router";
import { supabaseClient } from "../libs/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Upload, File, Trash2 } from "lucide-react";

export const KnowledgePage = () => {

  const { id } = useParams();
  const queryClient = useQueryClient();

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

      const filePath = `${id}/${Date.now()}-${file.name}`;

      const { error } = await supabaseClient.storage
        .from("files")
        .upload(filePath, file);

      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileName: string) => {

      const { error } = await supabaseClient.storage
        .from("files")
        .remove([`${id}/${fileName}`]);

      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", id] });
    },
  });

  const fileUploadHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file);
  };

  return (
    <div className="grow px-20 py-8 bg-white">
      <h1 className="text-2xl font-semibold text-primary">Knowledge</h1>
      <p className="text-gray-600">
        Manage your agent's knowledge base.
      </p>

      {/* 上传 */}
      <section className="mb-5">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={fileUploadHandler}
        />

        <label
          htmlFor="file-upload"
          className="ml-auto px-5 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-2 cursor-pointer w-fit"
        >
          <Upload size={18} />
          {uploadMutation.isPending ? "Uploading..." : "Upload File"}
        </label>
      </section>

      {/* 列表 */}
      <section className="border border-gray-300 rounded-xl">
        <ul>
          {query.isLoading && (
            <li className="p-5 text-gray-400 text-center">
              Loading...
            </li>
          )}

          {!query.isLoading && query.data?.length === 0 && (
            <li className="p-5 text-gray-400 text-center">
              No files yet
            </li>
          )}

          {query.data?.map((file) => (
            <li
              key={file.name}
              className="p-5 border-b border-gray-200 last:border-0 flex items-center gap-3"
            >
              <File className="text-primary" size={20} />
              <span className="text-primary">{file.name}</span>

              <Trash2
                size={20}
                className="ml-auto text-gray-400 cursor-pointer hover:text-red-400 transition-colors duration-200"
                onClick={() =>
                  deleteMutation.mutate(file.name)
                }
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
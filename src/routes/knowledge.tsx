import { useParams } from "react-router"

import { Upload, File, Trash2 } from 'lucide-react';

export const KnowledgePage = () => {

    const { id } = useParams();

    const fakeData = [
        { id: 1, fileName: "Knowledge1.pdf" },
        { id: 2, fileName: "Knowledge2.pdf" },
        { id: 3, fileName: "Knowledge3.pdf" },
    ];

    return (
        <div className="grow px-20 py-8 bg-white">
            <h1 className=" text-2xl font-semibold text-primary">Knowledge</h1>
            <p className=" text-gray-600">Manage your agent's knowledge base.</p>
            <section className=" mb-5">
                <button className=" ml-auto px-5 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-2 cursor-pointer">
                    <Upload size={18} />
                    Upload File
                </button>
            </section>

            <section className=" border border-gray-300 rounded-xl">
                <ul>
                    {
                        fakeData.map(file => (
                            <li className=" p-5 border-b border-gray-200 last:border-0 flex items-center gap-3" key={file.id}>
                                <File className=" text-primary" size={20} />
                                <span className=" text-primary">{file.fileName}</span>
                                <Trash2 size={20} className=" ml-auto text-gray-400 cursor-pointer hover:text-red-400 transition-colors duration-200" />
                            </li>
                        ))
                    }
                </ul>
            </section>
        </div>
    )
}
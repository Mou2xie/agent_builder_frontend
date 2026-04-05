import { useParams } from "react-router"

export const KnowledgePage = () => {

    const { id } = useParams();

    const fakeData = [
        { id: 1, fileName: "Knowledge1.pdf" },
        { id: 2, fileName: "Knowledge2.pdf" },
        { id: 3, fileName: "Knowledge3.pdf" },
    ];

    return (
        <div className="grow p-5">
            <h1 className=" mt-5">Knowledge</h1>
            <section className=" mt-3">
                <button className=" w-32 py-1 bg-blue-500">Upload File</button>
            </section>
            <section>
                <ul>
                    {
                        fakeData.map(file => (
                            <li key={file.id}>{file.fileName}</li>
                        ))
                    }
                </ul>
            </section>
        </div>
    )
}
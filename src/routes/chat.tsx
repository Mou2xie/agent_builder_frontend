import { useParams } from "react-router";

export const ChatPage = () => {
    const { id } = useParams();

    return (
        <>
            chat page - {id}
        </>
    );
}
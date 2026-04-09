import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { Chatbar } from '../components/Chatbar';
import { Send } from 'lucide-react';

export const ChatPage = () => {

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: import.meta.env.VITE_CHAT_API,
        }),
    });
    const [input, setInput] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    const handleSubmit = () => {
        if (status !== 'ready') return;
        if (!input.trim()) return;

        sendMessage({ text: input });
        setInput('');
    };

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    useEffect(() => {
        if (status !== 'ready') return;
        inputRef.current?.focus();
    }, [status]);

    return (
        <>
            <Chatbar />
            <div
                ref={messagesContainerRef}
                className=' max-w-3xl mx-auto h-[75vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-5 '
            >
                {messages.map(message => (
                    <div className={` m-5 flex ${message.role === 'user' ? ' justify-end' : ' justify-start'}`} key={message.id}>
                        <div className={`px-4 py-2 rounded-lg ${message.role === 'user' ? ' bg-primary text-white' : ' text-primary '}`}>
                            {message.parts.map((part, index) =>
                                part.type === 'text' ? <span key={index}>{part.text}</span> : null,
                            )}
                        </div>

                    </div>

                ))}
            </div>
            <form className=' max-w-3xl mx-auto flex items-end w-full min-h-14 bg-white border-gray-100 shadow-sm p-5 rounded-lg '
                onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <textarea
                    ref={inputRef}
                    className=' grow focus:outline-none resize-none max-h-40 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    readOnly={status !== 'ready'}
                    rows={1}
                    placeholder="Ask away..."
                />
                <button type="submit" disabled={status !== 'ready'} className=" text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200">
                    <Send size={26} />
                </button>
            </form>

        </>
    );
}
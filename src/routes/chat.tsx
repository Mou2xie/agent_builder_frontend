import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { Chatbar } from '../components/Chatbar';
import { Send } from 'lucide-react';
import { useParams } from 'react-router';

export const ChatPage = () => {

    const { id } = useParams();
    const api = `${import.meta.env.VITE_CHAT_API}/${id}`;

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({ api }),
    });
    const isAiResponding = status === 'submitted' || status === 'streaming';
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
    }, [messages, isAiResponding]);

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
                {isAiResponding && (
                    <div className=" m-5 flex justify-start">
                        <div className=" px-4 py-2 rounded-lg bg-primary-light text-primary flex items-center gap-2">
                            <span className=" inline-flex gap-1" aria-hidden="true">
                                <span className=" w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:0ms]" />
                                <span className=" w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
                                <span className=" w-1.5 h-1.5 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <form className=' max-w-3xl mx-auto flex items-end w-full min-h-14 bg-background-card border-border-light shadow-sm p-5 rounded-lg '
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
                <button type="submit" disabled={status !== 'ready'} className=" text-text-muted cursor-pointer hover:text-text-secondary transition-colors duration-200">
                    <Send size={26} />
                </button>
            </form>

        </>
    );
}
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Chatbar } from '../components/Chatbar';
import { Send, CircleOff } from 'lucide-react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '../libs/supabaseClient';
import { resolveAvatarUrl } from '../libs/avatar';

export const ChatPage = () => {

    const { id } = useParams();
    const api = `${import.meta.env.VITE_CHAT_API}/${id}`;

    const agentQuery = useQuery({
        queryKey: ["chatbar", id],
        queryFn: async () => {
            const { data, error } = await supabaseClient.from("agents").select("name,avatar_url,status,welcome_message").eq("id", id).single();
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
    });

    const avatarSrc = resolveAvatarUrl(agentQuery.data?.avatar_url);
    const isOnline = agentQuery.data?.status === 'ONLINE';
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({ api }),
    });
    const isAiResponding = status === 'submitted' || status === 'streaming';
    const [input, setInput] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    const showWelcome = isOnline && messages.length === 0;

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
        <div className="flex flex-col h-dvh">
            <Helmet><title>Chat - NovaAgent</title></Helmet>
            <Chatbar avatarSrc={avatarSrc} name={agentQuery.data?.name} />

            {!isOnline && agentQuery.data && (
                <div className="flex flex-col items-center justify-center flex-1 text-text-muted px-4">
                    <CircleOff size={48} className="mb-4 text-text-muted/50" />
                    <p className="text-lg font-medium">The agent is offline</p>
                    <p className="text-sm mt-1">This agent is currently offline and cannot be reached.</p>
                </div>
            )}

            {isOnline && showWelcome && (
                <div className="flex flex-col items-center justify-center flex-1 px-4">
                    {avatarSrc && (
                        <img src={avatarSrc} alt="Agent Avatar" className="w-16 h-16 md:w-24 md:h-24 rounded-xl object-cover mb-4 md:mb-5" />
                    )}
                    <h1 className="font-heading text-xl md:text-2xl font-extrabold text-text-main mb-2 md:mb-3">
                        {agentQuery.data?.name}
                    </h1>
                    <p className="text-text-secondary text-sm md:text-base max-w-xs md:max-w-md text-center">
                        {`" ${agentQuery.data?.welcome_message} "`}
                    </p>
                </div>
            )}

            {isOnline && !showWelcome && (
                <div
                    ref={messagesContainerRef}
                    className='max-w-3xl w-full mx-auto flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-5'
                >
                    {messages.map(message => (
                        <div className={` m-3 md:m-5 flex ${message.role === 'user' ? ' justify-end' : ' justify-start'}`} key={message.id}>
                            <div className={`px-4 py-2 rounded-lg ${message.role === 'user' ? ' bg-primary text-white' : ' text-primary '}`}>
                                {message.parts.map((part, index) =>
                                    part.type === 'text' ? <span key={index}>{part.text}</span> : null,
                                )}
                            </div>
                        </div>
                    ))}
                    {isAiResponding && (
                        <div className=" m-3 md:m-5 flex justify-start">
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
            )}

            {isOnline && (
                <div className="shrink-0 px-3 pb-4 pt-2 md:px-4 md:pb-6 md:pt-3">
                    <form className='max-w-3xl mx-auto flex items-end w-full min-h-14 bg-background-card border-border-light shadow-sm p-3 md:p-5 rounded-lg'
                        onSubmit={e => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <textarea
                            ref={inputRef}
                            className='grow focus:outline-none resize-none max-h-40 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
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
                        <button type="submit" disabled={status !== 'ready'} className=" text-primary cursor-pointer hover:text-primary-hover transition-colors duration-200">
                            <Send size={26}/>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

import { useEffect, useRef } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ open, onClose, title, children }: ModalProps) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={(e) => {
                if (e.target === overlayRef.current) onClose();
            }}
        >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-primary">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-primary transition-colors duration-200 cursor-pointer text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
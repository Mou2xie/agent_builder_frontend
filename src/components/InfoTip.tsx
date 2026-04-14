import type { ReactNode } from "react";
import { Info } from "lucide-react";

interface InfoTipProps {
    content: ReactNode;
    children?: ReactNode;
    iconClassName?: string;
}

export const InfoTip = ({ content, children, iconClassName = "" }: InfoTipProps) => {
    return (
        <div className="flex items-center gap-2 relative">
            {children}
            <span className="group/icon relative cursor-help text-gray-400 hover:text-primary transition-colors duration-200">
                <Info size={18} className={iconClassName} />
                <div className="invisible opacity-0 group-hover/icon:visible group-hover/icon:opacity-100 transition-opacity duration-200 absolute left-0 top-full mt-2 z-50 w-100 rounded-lg border border-gray-200 bg-gray-100 text-gray-700 text-sm px-4 py-3 shadow pointer-events-none group-hover/icon:pointer-events-auto">
                {content}
                </div>
            </span>
        </div>
    );
};
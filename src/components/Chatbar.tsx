import { NavLink } from 'react-router';

interface ChatbarProps {
    avatarSrc?: string | null;
    name?: string;
}

export const Chatbar = ({ avatarSrc, name }: ChatbarProps) => {
    return (
        <nav className=" h-16 bg-background-card border-b border-border-light flex items-center px-4 md:px-20">
            {avatarSrc && (
                <img src={avatarSrc} alt="Agent Avatar" className=" w-9 h-9 md:w-11 md:h-11 rounded-lg object-cover shrink-0" />
            )}
            <div className='ml-3 md:ml-4 min-w-0'>
                <h2 className=" font-heading text-base md:text-xl font-extrabold text-text-main truncate">{name}</h2>
                <p className=' text-[10px] md:text-[12px] text-text-muted -mt-0.5 md:-mt-1'>Powered by NovaAgent</p>
            </div>
            <NavLink to="/" target='blank' className="ml-auto px-3 md:px-5 py-1.5 md:py-2 text-xs md:text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200 shrink-0">
                <span className="hidden md:inline">Create my agent</span>
                <span className="md:hidden">Create</span>
            </NavLink>
        </nav>
    )
}

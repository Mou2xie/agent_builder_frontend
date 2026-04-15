import { NavLink } from 'react-router';

interface ChatbarProps {
    avatarSrc?: string | null;
    name?: string;
}

export const Chatbar = ({ avatarSrc, name }: ChatbarProps) => {
    return (
        <nav className=" h-16 bg-background-card border-b border-border-light flex items-center px-20">
            {avatarSrc && (
                <img src={avatarSrc} alt="Agent Avatar" className=" w-11 h-11 rounded-lg object-cover" />
            )}
            <div className='ml-4'>
                <h2 className=" font-heading text-xl font-extrabold text-text-main ">{name}</h2>
                <p className=' text-[12px] text-text-muted -mt-1'>Powered by NovaAgent</p>
            </div>
            <NavLink to="/" target='blank' className="ml-auto px-5 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200">
                Create my agent
            </NavLink>
        </nav>
    )
}

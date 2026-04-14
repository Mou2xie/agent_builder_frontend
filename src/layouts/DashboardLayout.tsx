import { Outlet } from "react-router"
import { Topbar } from "../components/Topbar"
import { NavLink } from "react-router"
import { useParams } from "react-router"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router";

import { BotMessageSquare, GraduationCap, Paintbrush, Rocket, Goal } from 'lucide-react';

export const DashboardLayout = () => {
    const { id } = useParams();
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    if (!user) {
        navigate("/login");
    }

    return (
        <>
            <Topbar />
            <section className="flex">
                <aside className="w-26 min-h-screen bg-background-card border-r border-border-light p-10">
                    <nav className="flex flex-col items-center gap-10">

                        <NavLink to={`/dashboard/agent/${id}/personnel`} className="text-sm flex flex-col items-center gap-1">
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-xl ${isActive ? 'bg-primary' : ''}`}>
                                        <BotMessageSquare size={28} className={`${isActive ? 'text-white' : 'text-text-main'}`} />
                                    </div>
                                    <p className={`${isActive ? 'text-primary' : 'text-text-main'}`}>Personnel</p>
                                </>
                            )}
                        </NavLink>

                        <NavLink to={`/dashboard/agent/${id}/knowledge`} className="text-sm flex flex-col items-center gap-1">
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-xl ${isActive ? 'bg-primary' : ''}`}>
                                        <GraduationCap size={28} className={`${isActive ? 'text-white' : 'text-text-main'} transition-colors duration-200`} />
                                    </div>
                                    <p className={`${isActive ? 'text-primary' : 'text-text-main'} transition-colors duration-200`}>Knowledge</p>
                                </>
                            )}
                        </NavLink>

                        <NavLink to={`/dashboard/agent/${id}/rule`} className="text-sm flex flex-col items-center gap-1">
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-xl ${isActive ? 'bg-primary' : ''}`}>
                                        <Goal size={28} className={`${isActive ? 'text-white' : 'text-text-main'} transition-colors duration-200`} />
                                    </div>
                                    <p className={`${isActive ? 'text-primary' : 'text-text-main'} transition-colors duration-200`}>Rule</p>
                                </>
                            )}
                        </NavLink>

                        <NavLink to={`/dashboard/agent/${id}/behavior`} className="text-sm flex flex-col items-center gap-1">
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-xl ${isActive ? 'bg-primary' : ''}`}>
                                        <Paintbrush size={28} className={`${isActive ? 'text-white' : 'text-text-main'} transition-colors duration-200`} />
                                    </div>
                                    <p className={`${isActive ? 'text-primary' : 'text-text-main'} transition-colors duration-200`}>Behavior</p>
                                </>
                            )}
                        </NavLink>

                        <NavLink to={`/dashboard/agent/${id}/share`} className="text-sm flex flex-col items-center gap-1">
                            {({ isActive }) => (
                                <>
                                    <div className={`p-2 rounded-xl ${isActive ? 'bg-primary' : ''}`}>
                                        <Rocket size={28} className={`${isActive ? 'text-white' : 'text-text-main'} transition-colors duration-200`} />
                                    </div>
                                    <p className={`${isActive ? 'text-primary' : 'text-text-main'} transition-colors duration-200`}>Share</p>
                                </>
                            )}
                        </NavLink>

                    </nav>
                </aside>
                <Outlet />
            </section>
        </>
    )
}

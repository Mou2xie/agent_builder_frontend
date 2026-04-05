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
                <aside className="w-28 min-h-screen border-r border-gray-200 p-10">
                    <nav className="flex flex-col items-center gap-10">

                        <NavLink to={`/dashboard/agent/${id}/personnel`} className={({ isActive }) => ` text-sm space-y-2 ${isActive ? ' text-primary' : ' text-gray-400'}`}>
                            <BotMessageSquare size={32} className=" mx-auto" />
                            <p>Personnel</p>
                        </NavLink>

                        <NavLink to={`/dashboard/agent/${id}/knowledge`} className={({ isActive }) => `text-sm space-y-2 group ${isActive ? ' text-primary' : ' text-gray-400'}`}>
                            <GraduationCap size={32} className=" mx-auto group-hover:text-primary transition-colors duration-200" />
                            <p className="group-hover:text-primary transition-colors duration-200">Knowledge</p>
                        </NavLink>

                        <NavLink to={`/dashboard/agent/${id}/actions`} className={({ isActive }) => `text-sm space-y-2 group ${isActive ? ' text-primary' : ' text-gray-400'}`}>
                            <Goal size={32} className=" mx-auto group-hover:text-primary transition-colors duration-200" />
                            <p className="group-hover:text-primary transition-colors duration-200">Actions</p>
                        </NavLink>

                        <NavLink to={`/dashboard/agent/${id}/appearance`} className={({ isActive }) => `text-sm space-y-2 group ${isActive ? ' text-primary' : ' text-gray-400'}`}>
                            <Paintbrush size={32} className=" mx-auto group-hover:text-primary transition-colors duration-200" />
                            <p className="group-hover:text-primary transition-colors duration-200">Appearance</p>
                        </NavLink>

                        <NavLink to={`/dashboard/agent/${id}/share`} className={({ isActive }) => `text-sm space-y-2 group ${isActive ? ' text-primary' : ' text-gray-400'}`}>
                            <Rocket size={32} className=" mx-auto group-hover:text-primary transition-colors duration-200" />
                            <p className="group-hover:text-primary transition-colors duration-200">Share</p>
                        </NavLink>

                    </nav>
                </aside>
                <Outlet />
            </section>
        </>
    )
}

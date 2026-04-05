import { Outlet } from "react-router"
import { Topbar } from "../components/Topbar"
import { NavLink } from "react-router"
import { useParams } from "react-router"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router";

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
                <aside className="w-32 bg-gray-400">
                    <nav className="flex flex-col gap-10">
                        <NavLink to={`/dashboard/agent/${id}/personnel`} className={({ isActive }) => `text-center ${isActive ? ' text-red-500' : ' text-white'}`}>Personnel</NavLink>
                        <NavLink to={`/dashboard/agent/${id}/knowledge`} className={({ isActive }) => `text-center ${isActive ? ' text-red-500' : ' text-white'}`}>Knowledge</NavLink>
                        <NavLink to={`/dashboard/agent/${id}/actions`} className={({ isActive }) => `text-center ${isActive ? ' text-red-500' : ' text-white'}`}>Actions</NavLink>
                        <NavLink to={`/dashboard/agent/${id}/appearance`} className={({ isActive }) => `text-center ${isActive ? ' text-red-500' : ' text-white'}`}>Appearance</NavLink>
                        <NavLink to={`/dashboard/agent/${id}/share`} className={({ isActive }) => `text-center ${isActive ? ' text-red-500' : ' text-white'}`}>Share</NavLink>
                    </nav>
                </aside>
                <Outlet />
            </section>
        </>
    )
}

import { useAuthStore } from "../stores/useAuthStore"
import { NavLink } from "react-router";

export const Navbar = () => {

    const user = useAuthStore(state => state.user);

    return (
        <nav className="h-16 fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md flex items-center px-20">
            <NavLink to="/" className="font-heading text-2xl font-extrabold text-text-main">
                BuildMyAgent
            </NavLink>
            <div className=" ml-3 text-primary px-4 py-0.5 border border-primary rounded-full">
                Beta
            </div>
            <div className="ml-auto flex items-center gap-6">
                {user ? (
                    <NavLink to="/dashboard/agent-list" className="px-5 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-85 transition-opacity duration-200 cursor-pointer">
                        Dashboard
                    </NavLink>
                ) : (
                    <>
                        <NavLink to="/login" className="text-sm text-text-secondary hover:text-text-main transition-colors duration-200">
                            Log in
                        </NavLink>
                        <NavLink to="/signup" className="px-5 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-85 transition-opacity duration-200 cursor-pointer">
                            Get Started
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}
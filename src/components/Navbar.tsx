import { useAuthStore } from "../stores/useAuthStore"
import { NavLink } from "react-router";
import logo from "../assets/logo.svg";

export const Navbar = () => {

    const user = useAuthStore(state => state.user);

    return (
        <nav className="h-16 fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md flex items-center px-4 md:px-20">
            <NavLink to="/" className="flex items-center gap-1.5 md:gap-2 font-heading text-xl md:text-2xl font-extrabold text-text-main">
                <img src={logo} alt="Logo" className="h-8 w-8 md:h-10 md:w-10" />
                NovaAgent
            </NavLink>
            <div className=" ml-2 md:ml-3 text-primary text-xs md:text-sm px-2.5 md:px-4 py-0.5 border border-primary rounded-full">
                Beta
            </div>
            <div className="ml-auto hidden md:flex items-center gap-6">
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
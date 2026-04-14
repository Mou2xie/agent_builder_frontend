import { useAuthStore } from "../stores/useAuthStore"
import { NavLink } from "react-router";


// used in landing page
export const Navbar = () => {

    const user = useAuthStore(state => state.user);

    return (
        <nav className=" h-16 flex items-center px-20">
            <h2 className=" font-heading text-2xl font-extrabold text-text-main">Agent Builder</h2>
            <NavLink to={user ? '/dashboard/agent-list' : '/login'} className=" ml-auto px-3 py-2 text-sm bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200">
                {user ? 'Dashboard' : 'Log in'}
            </NavLink>
        </nav>
    )
}
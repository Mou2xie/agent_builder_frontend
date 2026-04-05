import { Navbar } from "../components/Navbar";
import { Outlet } from "react-router";

export const LandingLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}
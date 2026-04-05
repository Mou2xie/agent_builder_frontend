import { Outlet } from "react-router";
import { useEffect } from "react";
import { supabaseClient } from "../libs/supabaseClient";
import { useAuthStore } from "../stores/useAuthStore";

export const RootLayout = () => {

    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            const {
                data: { user },
            } = await supabaseClient.auth.getUser();

            if (isMounted) {
                setUser(user);
            }
        };

        initAuth();

        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [setUser]);

    return (
        <>
            <Outlet />
        </>
    )
}
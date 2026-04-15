import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, NavLink } from "react-router";
import humanhand from "../assets/humanhand.png";
import logo from "../assets/logo.svg";

export const LoginPage = () => {


    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const mutation = useMutation({
        mutationFn: async ({ email, password }: { email: string, password: string }) => {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        onSuccess: (data) => {
            setUser(data.user);
            navigate("/");
        }
    });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    }

    return (
        <div className=" min-h-screen flex justify-center items-center bg-background-hero relative">
            <div className=" absolute top-5 left-5 flex items-center gap-2">
                <img src={logo} alt="NovaAgent logo" className=" w-8 h-8" />
                <p className=" font-heading font-bold text-xl text-text-main">NovaAgent</p>
            </div>
            <section className=" max-w-1000 flex bg-[#9EA0D3] rounded-2xl overflow-hidden">
                <div className="pr-20 relative">
                    <img src={humanhand} alt="Human hand" className=" mt-20 max-w-100 object-contain" />
                    <div className=" absolute bottom-15 right-10 w-90 text-white font-heading font-thin ">
                        <p>
                            “The past is just a story we tell ourselves.”
                        </p>
                        <p className=" text-right italic text-sm mt-1">— Her (2013)</p>
                    </div>
                </div>
                <section className=" px-20 py-25 flex flex-col justify-center bg-background-card">
                    <h2 className=" font-heading font-bold text-text-main text-2xl">Welcome back</h2>
                    <p className=" text-text-muted">Your AI. Getting things done</p>
                    <form className=" flex flex-col mt-5" onSubmit={submitHandler}>
                        <input className=" border border-border-light rounded-lg px-3 py-2 placeholder:text-text-muted placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-primary" type="email" name="email" placeholder="Email" value={formData.email} onChange={inputChangeHandler} required />
                        <input className=" border border-border-light rounded-lg px-3 py-2 mt-3 placeholder:text-text-muted placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-primary" type="password" name="password" value={formData.password} placeholder="Password" onChange={inputChangeHandler} required />
                        {
                            mutation.isError && (
                                <p className=" bg-red-100 text-red-500 text-sm mt-3 px-2 py-1 rounded">
                                    {mutation.error.message}
                                </p>
                            )
                        }
                        <button className=" bg-primary text-white py-2 rounded-lg mt-5 hover:opacity-85 transition-opacity duration-200 cursor-pointer" type="submit">
                            {mutation.isPending ? "Logging in..." : "Log in"}
                        </button>
                    </form>
                    <p className=" text-text-muted mt-10 ">
                        Don't have an account? <NavLink to="/signup" className=" text-text-secondary underline">Sign up</NavLink>
                    </p>
                </section>
            </section>

        </div>
    );
}
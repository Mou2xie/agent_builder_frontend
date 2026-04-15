import { useState } from "react"
import { NavLink, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabaseClient } from "../libs/supabaseClient";
import { useAuthStore } from "../stores/useAuthStore";
import robothand from "../assets/robothand.png";
import logo from "../assets/logo.svg";

export const SignupPage = () => {

    const setUser = useAuthStore((state) => state.setUser);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const mutation = useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password
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
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        mutation.mutate({ email: formData.email, password: formData.password });
    }

    return (
        <div className=" min-h-screen flex justify-center items-center bg-background-hero relative">
            <Helmet><title>Signup - NovaAgent</title></Helmet>
            <div className=" absolute top-5 left-5 flex items-center gap-2">
                <img src={logo} alt="NovaAgent logo" className=" w-8 h-8" />
                <p className=" font-heading font-bold text-xl text-text-main">NovaAgent</p>
            </div>
            <section className=" max-w-1000 flex bg-[#9EA0D3] rounded-2xl overflow-hidden">
                <div className=" px-20 py-25 flex flex-col justify-center bg-background-card">
                    <h2 className="  font-heading font-bold text-text-main text-2xl">Create Account</h2>
                    <form className=" flex flex-col mt-5" onSubmit={submitHandler}>
                        <input className=" border border-border-light rounded-lg px-3 py-2 placeholder:text-text-muted placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-primary" type="email" name="email" placeholder="Email" value={formData.email} onChange={inputChangeHandler} required />
                        <input className=" border border-border-light rounded-lg px-3 py-2 mt-3 placeholder:text-text-muted placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-primary" type="password" name="password" value={formData.password} placeholder="Password" onChange={inputChangeHandler} required />
                        <input className=" border border-border-light rounded-lg px-3 py-2 mt-3 placeholder:text-text-muted placeholder:text-sm focus:outline-none focus:ring-1 focus:ring-primary" type="password" name="confirmPassword" value={formData.confirmPassword} placeholder="Confirm Password" onChange={inputChangeHandler} required />
                        {
                            mutation.isError && (
                                <p className=" bg-red-100 text-red-500 text-sm mt-3 px-2 py-1 rounded">
                                    {mutation.error.message}
                                </p>
                            )
                        }
                        <button className=" bg-primary text-white py-2 rounded-lg mt-5 hover:opacity-85 transition-opacity duration-200 cursor-pointer" type="submit">
                            {mutation.isPending ? "Signing up..." : "Sign up"}
                        </button>
                    </form>

                    <p className=" text-text-muted mt-10">
                        Already have an account? <NavLink to="/login" className=" text-text-secondary underline">Log in</NavLink>
                    </p>

                </div>
                <div className="pl-20 relative">
                    <img src={robothand} alt="Robot hand" className=" mt-50 max-w-100 object-contain" />
                    <div className=" absolute top-15 left-10 w-80 text-white font-heading font-thin ">
                        <p>
                            "Can a robot write a symphony? Can a robot turn a canvas into a beautiful masterpiece?"
                        </p>
                        <p className=" text-right italic text-sm">— I, Robot (2004)</p>
                    </div>
                </div>
            </section>

        </div>
    )
}
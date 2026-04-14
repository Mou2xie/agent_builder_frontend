import { useState } from "react"
import { NavLink, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";
import { useAuthStore } from "../stores/useAuthStore";

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
        <div className=" min-h-screen flex justify-center items-center">
            <div className=" w-130 py-10 px-20 rounded-2xl shadow-card-soft bg-background-card">
                <h2 className=" font-heading font-extrabold text-text-main text-xl text-center">Create Account</h2>
                <form className=" flex flex-col mt-5" onSubmit={submitHandler}>
                    <input className=" border border-border-light rounded-lg pl-2 py-2 placeholder:text-text-muted placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" type="email" name="email" placeholder="Email" value={formData.email} onChange={inputChangeHandler} required />
                    <input className=" border border-border-light rounded-lg pl-2 py-2 mt-3 placeholder:text-text-muted placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" type="password" name="password" value={formData.password} placeholder="Password" onChange={inputChangeHandler} required />
                    <input className=" border border-border-light rounded-lg pl-2 py-2 mt-3 placeholder:text-text-muted placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" type="password" name="confirmPassword" value={formData.confirmPassword} placeholder="Confirm Password" onChange={inputChangeHandler} required />
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
                
                <p className=" text-text-muted mt-10 mb-20 text-center">
                    Already have an account? <NavLink to="/login" className=" text-text-secondary underline">Log in</NavLink>
                </p>

            </div>
        </div>
    )
}
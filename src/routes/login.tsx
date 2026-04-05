import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabaseClient } from "../libs/supabaseClient";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, NavLink } from "react-router";

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
        <div className=" min-h-screen flex ">
            <section className=" grow bg-tertiary">

            </section>
            <section className=" w-112.5 p-20 flex flex-col justify-center">
                <h2 className=" font-heading font-extrabold text-primary text-2xl">Agent Builder</h2>
                <p className=" text-gray-400">Your AI. Getting things done</p>
                <form className=" flex flex-col mt-5" onSubmit={submitHandler}>
                    <input className=" border rounded-lg pl-2 py-2 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" type="email" name="email" placeholder="Email" value={formData.email} onChange={inputChangeHandler} required />
                    <input className=" border rounded-lg pl-2 py-2 mt-3 placeholder:text-gray-400 placeholder:text-sm focus:outline-none focus:ring-1 focus: ring-primary" type="password" name="password" value={formData.password} placeholder="Password" onChange={inputChangeHandler} required />
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
                <p className=" text-gray-400 mt-10 mb-30">
                    Don't have an account? <NavLink to="/signup" className=" text-gray-600 underline">Sign up</NavLink>
                </p>
            </section>


        </div>
    );
}
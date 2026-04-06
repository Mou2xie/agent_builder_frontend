import { useParams } from "react-router"

import { SquarePen, Pause, Trash2 } from 'lucide-react';

import { Plus } from "lucide-react";

export const ActionsPage = () => {
    const { id } = useParams();

    return (
        <div className="grow px-20 py-8 bg-white">
            <h1 className=" text-2xl font-semibold text-primary">Actions</h1>
            <p className=" text-gray-600">Manage your agent's actions.</p>
            <section className=" mb-5">
                <button className=" ml-auto px-5 py-2 bg-primary text-white rounded-sm hover:opacity-85 transition-opacity duration-200 flex items-center gap-2 cursor-pointer">
                    <Plus size={18} />Add Rules
                </button>
            </section>
            <section className=" grid grid-cols-2 gap-5">
                <div className=" border rounded-xl p-5 space-y-5">
                    <div className=" flex items-baseline gap-10">
                        <p className=" text-gray-400">Keywords</p>
                        <div className=" flex gap-2">
                            <span className=" px-3 py-1 border rounded-full text-sm">
                                portfolio
                            </span>
                            <span className=" px-3 py-1 border rounded-full text-sm">
                                stock price
                            </span>
                        </div>
                    </div>
                    <div className=" flex items-baseline gap-10">
                        <p className=" text-gray-400">Response</p>
                        <p>Check the stock price of $AAPL and update the portfolio value accordingly.</p>
                    </div>
                    <div className=" flex justify-end gap-5">
                        <SquarePen size={20} className=" text-gray-400 cursor-pointer hover:text-primary transition-colors duration-200" />
                        <Pause size={20} className=" text-gray-400 cursor-pointer hover:text-primary transition-colors duration-200" />
                        <Trash2 size={20} className=" text-gray-400 cursor-pointer hover:text-red-400 transition-colors duration-200" />
                    </div>
                </div>
            </section>
        </div>
    )
}
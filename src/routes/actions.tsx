import { useParams } from "react-router"

export const ActionsPage = () => {
    const { id } = useParams();
    return (
        <div className="grow p-5">
            <h1 className=" mt-5">Actions</h1>
            <section className=" mt-3">
                <button className=" w-32 py-1 bg-blue-500">Add Action</button>
            </section>
            <section className=" grid grid-cols-3 mt-5">
                <div className=" border p-3 space-y-5">
                    <div className=" flex items-center gap-5">
                        <p>Keywords</p>
                        <div className=" space-x-1">
                            <span className=" px-3 py-1 border rounded-full">
                                portfolio
                            </span>
                            <span className=" px-3 py-1 border rounded-full">
                                stock price
                            </span>
                        </div>
                    </div>
                    <div className=" flex gap-5">
                        <p>Response</p>
                        <p>Check the stock price of $AAPL and update the portfolio value accordingly.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
import { Link, QrCode, Copy } from 'lucide-react';


export const SharePage = () => {
    return (
        <div className="grow px-20 py-8 bg-white">
            <h1 className=" text-2xl font-semibold text-primary">Share</h1>
            <p className=" text-gray-600 mb-8">Share your agent with others</p>
            <section className=" space-y-10">
                <div className=' inline-block'>
                    <h2 className=" text-primary mb-3 flex items-center gap-2">
                        <Link size={18} />
                        Link
                        </h2>
                    <p className=" px-5 py-2 bg-slate-200 rounded-xl flex items-center gap-3 ">
                        <span className=' text-primary'>https://example.com</span>
                        <Copy size={18} className=" text-gray-400 cursor-pointer hover:text-primary transition-colors duration-200" />
                    </p>
                </div>
                <div>
                    <h2 className=" text-primary mb-3 flex items-center gap-2">
                        <QrCode size={18} />
                        QR Code</h2>
                    <div className=" w-30 h-30 bg-gray-400"></div>
                </div>
            </section>
        </div>
    )
}
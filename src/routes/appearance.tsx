import { useParams } from "react-router"
import { useState } from "react"

export const AppearancePage = () => {

    const { id } = useParams();

    const [formData, setFormData] = useState({
        themeColour: "",
        welcomeMessage: "",
        tone: "formal",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    }
    return (
        <div className="grow p-5">
            <h1 className=" mt-5">Appearance</h1>
            <form className=" flex flex-col w-1/2">
                <label className=" flex flex-col">
                    <span>Theme Colour</span>
                    <input type="text" id="themeColour" name="themeColour" className=" border" onChange={handleChange} value={formData.themeColour}/>
                </label>
                <label className=" flex flex-col">
                    <span>Welcome Message</span>
                    <textarea name="welcomeMessage" id="welcomeMessage" className=" border" onChange={handleChange} value={formData.welcomeMessage}></textarea>
                </label>
                <label className=" flex flex-col">
                    <span>Tone</span>
                    <select name="tone" id="tone" className=" border" onChange={handleChange} value={formData.tone}>
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="neutral">Neutral</option>
                    </select>
                </label>
                <button type="submit" className=" my-10 w-32 py-1 bg-blue-500">Save</button>
            </form>
        </div>
    )
}
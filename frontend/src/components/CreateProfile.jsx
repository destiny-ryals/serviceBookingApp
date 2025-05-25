import { useState } from "react"
import { createProfile } from "../api"
import { useNavigate } from "react-router-dom";

export function CreateProfile() {
    const navigate = useNavigate()
    const services = ["Hair", "Makeup", "Nails", "Esthetics"];
    const [availability, setAvailability] = useState({
        Monday: { available: false, start: "", end: "" },
        Tuesday: { available: false, start: "", end: "" },
        Wednesday: { available: false, start: "", end: "" },
        Thursday: { available: false, start: "", end: "" },
        Friday: { available: false, start: "", end: "" },
        Saturday: { available: false, start: "", end: "" },
        Sunday: { available: false, start: "", end: "" }
    })
    const [profile, setProfile] = useState({
        businessName: "",
        services: "",
        location: "",
        bio: "",
        availability: "",
        setupComplete: false
    })

    function handleChange(e) {
        if (e.target.dataset.field) {
            setAvailability(prev => ({
                ...prev, [e.target.name]: {
                    ...prev[e.target.name],
                    [e.target.dataset.field]: e.target.type === "checkbox"
                        ? e.target.checked : e.target.value
                }
            }))
        } else {
            setProfile({ ...profile, [e.target.name]: e.target.value })
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const newProfile = { ...profile, availability, setupComplete: true }
        console.log("Sending Profile:", newProfile)
        const token = sessionStorage.getItem("User")
        try {
            let response = await createProfile(newProfile, token)
            if (response.status === 200) {
                alert("Profile Created!")
                navigate("/home")
            } else {
                alert("Error creating profile")
            }
        } catch (error) {
            console.error("Create profile failed:", error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder={"Business Name"} onChange={handleChange} name="businessName" required maxLength={20} />
            <input placeholder={"Location"} onChange={handleChange} name="location" required maxLength={20} />
            <textarea placeholder={"Bio"} onChange={handleChange} name="bio" required maxLength={5000} />
            <select name="services" value={profile.services} onChange={handleChange} required>
                <option value="">Select a Service</option>
                {services.map((service) => (
                    <option key={service} value={service}>{service}</option>
                ))}
            </select>
            {Object.entries(availability).map(([day, values]) => (
                <div key={day}>
                    <label>
                        <input type="checkbox" name={day} data-field="available" checked={values.available} onChange={handleChange} />{day}
                    </label>
                    <input type="time" name={day} data-field="start" value={values.start} onChange={handleChange} disabled={!values.available} />
                    <input type="time" name={day} data-field="end" value={values.end} onChange={handleChange} disabled={!values.available} />
                </div>
            ))}
            <button type="submit">Create Profile</button>

        </form>
    )
}
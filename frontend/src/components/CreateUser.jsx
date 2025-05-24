import { useState } from "react"
import { createUser } from "../api"

export function CreateUser() {
    const roles = ["customer", "provider"];
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    })

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!user.role || !roles.includes(user.role)) {
            alert("Please select a valid role");
            return;
        }
        let response = await createUser(user)
        if (response.status !== 200) {
            alert("User account could not be created")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder={"Name"} onChange={handleChange} name="name" required maxLength={20} />
            <input placeholder={"Email"} onChange={handleChange} name="email" required maxLength={20} />
            <select name="role" value={user.role} onChange={handleChange}>
                <option value="">Select a Role</option>
                {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
            <input placeholder={"Password"} onChange={handleChange} name="password" type="password" required maxLength={20} />
            <button type="submit">Create Account</button>

        </form>
    )
}
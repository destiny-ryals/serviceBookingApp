import axios from "axios"
import { verifyUser } from "../api"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export function Login() {

    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate()

    function handleChange(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        let response = await verifyUser(user)
        console.log("Login response:", response)
        if ( response.success) {
            sessionStorage.setItem("token", response.token)
            axios.defaults.headers.common["Authorization"] = `Bearer ${response.token}`

            if (response.role === "provider") {
                if (!response.profileId) {
                    navigate("/setup")
                } else {
                    navigate("/home")
                }
            } else {
                navigate("/home")
            }
        } else {
            alert("Login Failed")
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder={"Email"} onChange={handleChange} name="email" required maxLength={40} />
            <input placeholder={"Password"} onChange={handleChange} name="password" type="password" required maxLength={20} />
            <button type="submit">Log In</button>
        </form>
    )
}
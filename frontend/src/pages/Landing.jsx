import { CreateUser } from "../components/CreateUser"
import { Login } from "../components/Login"
import { useState } from "react"

export function Landing() {

    const [view, setView] = useState(0)

    return (
        <div>
            {!view ?
                <div>
                    <Login />
                    <button onClick={() => setView(!view)}>Create New Account</button>
                </div> :
                <div>
                    <CreateUser />
                    <button onClick={() => setView(!view)}>Log In to Existing Account</button>
                </div>}
        </div>
    )
}
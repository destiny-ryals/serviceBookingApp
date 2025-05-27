import { jwtDecode } from "jwt-decode"
import ProviderHome from "../components/ProviderHome"
import UserHome from "../components/UserHome"


export function Home() {

    const user = jwtDecode(sessionStorage.getItem("User"))

    return user.role === "provider" ? <ProviderHome/> : <UserHome/>

}
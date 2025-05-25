import axios from "axios"
import * as jwt_decode from "jwt-decode"

const URL = "http://localhost:12000"

export async function getUser(id) {
    const response = await axios.get(`${URL}/users/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function createUser(user) {
    const response = await axios.post(`${URL}/users`, user)
    return response
}

export async function updateUser(id, user) {
    const response = await axios.put(`${URL}/users/${id}`, user)
    return response.data
}

export async function getProfiles() {
    const response = await axios.get(`${URL}/providers`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function getProfile(id) {
    const response = await axios.get(`${URL}/providers/${id}`)

    if (response.status === 200) {
        return response.data
    } else {
        return
    }
}

export async function createProfile(user, token) {
    const response = await axios.post(`${URL}/providers/profile`, user,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response
}

export async function updateProfile(profileData, token) {
    const response = await axios.put(`${URL}/providers/profile`, profileData, {
          headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export async function verifyUser(user) {
    const response = await axios.post(`${URL}/users/login`, user)
    if (response?.data?.success) {
        const decoded = jwt_decode.jwtDecode(response.data.token)
        return {
            success: true,
            token: response.data.token,
            ...decoded,
            profileId:response.data.profileId,
        }
    } else {
        return
    }
}

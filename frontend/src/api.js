import axios from "axios"

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

export async function verifyUser(user) {
    const response = await axios.post(`${URL}/users/login`, user)
    if (response.data.success) {
        return response.data.token
    } else {
        return
    }
}
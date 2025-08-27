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
        const decoded = jwtDecode(response.data.token)
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
// ------------------ Review Functions ------------------
// Create Review
export async function createReview(providerId, reviewData, token) {
    console.log("Sending review to backend:", reviewData)
    const response = await axios.post(`${URL}/reviews/${providerId}`, reviewData, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return response.data
}

// Get All Reviews for Provider
export async function getProviderReviews(providerId) {
    const response = await axios.get(`${URL}/reviews/${providerId}`)
    return response.data;
}

// Delete Review
/*export async function deleteReview(reviewId) {
    const response = await axios.delete(`${URL}/reviews/${reviewId}`)
    return response
}*/

// Update Review
/*export async function updateReview(reviewId, data) {
    const response = await axios.put(`${URL}/reviews/${reviewId}`, data);
    return response;
}*/

// Get Average Rating for Provider
export async function getAverageRating(providerId) {
    const response = await axios.get(`${URL}/reviews/${providerId}/average`)
    return response.data
}
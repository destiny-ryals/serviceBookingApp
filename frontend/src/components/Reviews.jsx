import {useState, useEffect} from "react"
import { createReview, getProviderReviews, getAverageRating } from "../api"

export default function Reviews({providerId, token}){
    const [reviews, setReviews] = useState([])
    const [averageRating, setAverageRating] = useState(0)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [serviceDate, setServiceDate] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchReviews = async () => {
        try{
            const reviewData = await getProviderReviews(providerId)
            setReviews(reviewData.reviews || [])
            setAverageRating(reviewData.averageRating || 0)
            setLoading(false) 
        } catch (err){
            console.error("Error fetching reviews:", err)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [providerId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if(!token){
            alert("You must be logged in to submit a review.")
            return
        }
        if(!serviceDate){
            setError("Please select a service date.")
            return
        }

        try {
            await createReview(providerId, {rating, comment, serviceDate }, token)
            setRating(5)
            setComment("")
            setServiceDate("")
            fetchReviews()
        } catch (err) {
            console.error("Error creating reviews:", err)
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("An error occurred while submitting your review.");
            }
        }
    }

    if (loading) return <p>Loading reviews...</p>

    return(
        <div>
            <h2>Average rating: {averageRating.toFixed(1)}★</h2>
            <h3>Leave A Review</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date of Service</label>
                    <input 
                    type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} required/>
                </div>
                <div>
                    <label>Rating (1-5)</label>
                    <input 
                    type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} min="1" max="5"required/>
                </div>
                <div>
                    <label>Comment</label>
                    <textarea
                    value={comment} onChange={(e) => setComment(e.target.value)} required/>
                </div>
                <button type="submit">Submit Review</button>
            </form>

            {/* Review List */}
            <ul>
                {reviews.length === 0 && <p>No reviews yet.</p>}
                {reviews.map((r) =>(
                    <li key={r._id}>
                        <strong>{r.rating} ★</strong>  on {" "}
                        {new Date(r.serviceDate).toLocaleDateString("en-US", {timeZone: "UTC"})} by {r.username} - {r.comment}
                    </li>
                ))}
            </ul>
        </div>
    )
}
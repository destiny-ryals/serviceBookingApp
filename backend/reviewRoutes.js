const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "./config.env" })

let reviewRoutes = express.Router()

//#2 Verify User
function verifyUser(request, response, next) {
    const authHeaders = request.headers["authorization"]
    const token = authHeaders && authHeaders.split(' ')[1]
    if (!token) {
        return response.status(401).json({ message: "Authentication Token is missing" })
    }

    jwt.verify(token, process.env.SECRETKEY, (error, user) => {
        if (error) {
            return response.status(403).json({ message: "Invalid Token" })
        }
        request.user = user
        next()
    })
}
//#2 Create Review
reviewRoutes.route("/reviews/:providerId").post(verifyUser, async (request, response) => {
    const db = database.getDb();
    const providerId = new ObjectId(request.params.providerId)
    const userId = new ObjectId(request.user._id)
    const serviceDate = new Date(request.body.serviceDate)
    
    console.log({ providerId, userId, serviceDate })

    const user = await db.collection("users").findOne({_id: userId})
    if (!user) return response.status(404).json({ message: "User not found" })

    const startOfDay = new Date(serviceDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(serviceDate);
    endOfDay.setHours(23, 59, 59, 999);

     // Prevent Duplicate Reviews
    const existing = await db.collection("reviews").findOne({
        providerId,
        userId,
        serviceDate: {$gte: startOfDay, $lte: endOfDay}
        })
        console.log("Existing review found:", existing)

    if (existing){
        return response.status(400).json({message: "Review for this date already exists"})
    }

    console.log("Fetched user from DB:", user)
    
    const reviewData = {
        providerId,
        userId,
        username: user.name,
        rating: request.body.rating,
        serviceDate,
        comment: request.body.comment,
        createdAt: new Date()
        };

    const data = await db.collection("reviews").insertOne(reviewData)
    response.json(data);
})
//#3 Get Reviews By Provider
reviewRoutes.route("/reviews/:providerId").get(async (request, response) => {
    const db = database.getDb();
    const providerId = new ObjectId(request.params.providerId)
    const reviews = await db.collection("reviews").find({providerId}).toArray()
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            : 0;
    response.json({reviews, 
        averageRating: Number(averageRating.toFixed(1))
    })
})



//#4 Update Review
/* reviewRoutes.route("/reviews/:id").put(async (request, response) => {q
  const db = database.getDb();
  const reviewId = new ObjectId(request.params.id);
  const { rating, comment } = request.body;

  const updateData = {};
  if (rating !== undefined) updateData.rating = Number(rating);
  if (comment !== undefined) updateData.comment = comment;

  const result = await db.collection("reviews").findOneAndUpdate(
    { _id: reviewId },
    { $set: updateData },
    { returnDocument: "after" }
  );

  if (!result.value) return response.status(404).json({ message: "Review not found" });

  await updateProviderRating(result.value.providerId);

  response.json(result.value);
});

//#5 Delete Review
reviewRoutes.route("/reviews/:id").delete(async (request, response) => {
  const db = database.getDb();
  const reviewId = new ObjectId(request.params.id);

  const review = await db.collection("reviews").findOne({ _id: reviewId });
  if (!review) return response.status(404).json({ message: "Review not found" });

  await db.collection("reviews").deleteOne({ _id: reviewId });
  await updateProviderRating(review.providerId);

  response.json({ message: "Review deleted" });
}); */

//#6 Calculate Average Rating
reviewRoutes.route("reviews/:providerId/average").get(async (request, response) => {
    const db = database.getDb();
    const providerId = new ObjectId(request.params.providerId)

    const result = await db.collection("reviews").aggregate([
        {$match: {providerId}},
        {$group: {_id: "$providerId", averageRating: {$avg: "$rating"}, count: { $sum: 1} } }
    ]).toArray()

    if (result.length > 0){
        response.json(result[0])
    } else{
        response.json({ averageRating: 0, count: 0})
    }
})

module.exports = reviewRoutes;

const express = require("express")
const database = require("./connect")
const ObjectId = require("mongodb").ObjectId
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "./config.env" })

let providerRoutes = express.Router()

// Verify Profile(JWT Token)
function verifyProvider(request, response, next) {
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

//#1 Retrieve All Users

providerRoutes.route("/providers").get(async (request, response) => {
    let db = database.getDb()
    let providers = await db.collection("providersProfile").find({}).toArray()
    response.json(providers)
})
//#2 Retrieve User

providerRoutes.route("/providers/:id").get(async (request, response) => {
    let db = database.getDb()
    let profile = await db.collection("providersProfile").findOne({ _id: new ObjectId(request.params.id) })
    if (profile) {
        response.json(profile)
    } else {
        throw new Error("Profile was not found")
    }
})

//#3 Create User
providerRoutes.route("/providers/profile").post(verifyProvider, async (request, response) => {
    if (request.user.role !== "provider") {
        response.json({ message: "Only Providers can create a profile" })
    } else {
        let db = database.getDb()
        let profileData = {
            userId: new ObjectId(request.user._id),
            businessName: request.body.businessName,
            services: request.body.services,
            location: request.body.location,
            bio: request.body.bio,
            availability: request.body.availability,
        }
        let data = await db.collection("providersProfile").insertOne(profileData)
        console.log("Received Profile:", request.body)
        response.json(data)
    }
})

//#4 Update User

providerRoutes.route("/providers/profile").put(verifyProvider, async (request, response) => {
    let db = database.getDb()
    let profileData = {
        $set: {
            businessName: request.body.businessName,
            services: request.body.services,
            location: request.body.location,
            bio: request.body.bio,
            availability: request.body.availability,
        }
    }
    const userId = typeof request.user._id === 'string' ? new ObjectId(request.user._id) : request.user._id
let data = await db.collection("providersProfile").updateOne({ userId }, profileData)
    const check = await db.collection("providersProfile").findOne({
        userId: request.user._id
    });
    console.log("Post-update check:", check);
    response.json(data)

})

//#5 Delete User

providerRoutes.route("/providers/profile").delete(verifyProvider, async (request, response) => {
    let db = database.getDb()
    const userId = typeof request.user._id === 'string' ? new ObjectId(request.user._id) : request.user._id
    let data = await db.collection("providersProfile").deleteOne({ userId})
    response.json(data)

})


module.exports = providerRoutes
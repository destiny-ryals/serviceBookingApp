const express = require("express")
const cors = require("cors")
const users = require("./userRoutes")
const providers = require("./providerRoutes")
const reviews = require("./reviewRoutes")
const connect = require("./connect")

const app = express()
const PORT = 12000

app.use(cors())
app.use(express.json())

app.use(users)
app.use(providers)
app.use(reviews)

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})
const connect = require("./connect")
const express = require("express")
const cors = require("cors")
const users = require("./userRoutes")
const providers = require("./providerRoutes")

const app = express()
const PORT = 12000

app.use(cors())
app.use(express.json())
app.use(users)
app.use(providers)

app.listen(PORT, ()=>{
    connect.connectToServer()
    console.log(`Server is running on port ${PORT}`)
})
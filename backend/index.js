import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import ConntectToDb from "./config/db.js"
import dotenv from "dotenv"
import userRoute from "./router/user.router.js"
import postRoute from "./router/post.route.js"
import messageRoute from "./router/message.router.js"
import { app,server } from "./socket/socket.js"
dotenv.config({})
import path from "path"

// app.get("/",(req,res)=>{
//    return res.status(200).json({message:"I am a coder",success:true})
// })

const __dirname = path.resolve()


// middleware
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({extended:true}))
const corsOption = {
    origin:"http://localhost:5173",
    credentials:true,
}
app.use(cors(corsOption))

app.use("/api/v1/user",userRoute)
app.use("/api/v1/post",postRoute)
app.use("/api/v1/message",messageRoute)


app.use(express.static(path.join(__dirname, "frontend/dist")));

// Safe fallback route
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

const PORT = process.env.PORT || 8000

server.listen(PORT,(req,res)=>{
    console.log(`server connected on port ${PORT}`)
    ConntectToDb()
})
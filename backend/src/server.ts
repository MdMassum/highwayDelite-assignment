import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors'
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoConfig";
import errorMiddleware from './middleware/error'
import authRouter from '../src/routes/auth.route'
import noteRouter from '../src/routes/notes.route'


import helmet from 'helmet';
import rateLimit from 'express-rate-limit';


// handling uncaught exception
process.on("uncaughtException",(err:any)=>{
    console.log(`Error : ${err.message}`)
    console.log("Shutting down the server due to uncaught exception")

    server.close(()=>{
        process.exit(1);
    })
})


const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// rate limit
app.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100,
    message: "Too many attempts from this IP, please try again later.",
    })); // Rate limiting
 
 app.use(helmet());
 app.use(rateLimit({}))

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma",
      ],
    credentials: true
}))


// health check route -->
app.get('/',(req:Request, res:Response)=>{
    res.json({
        "message":"server up and running"
    })
})
// auth routes -->
app.use('/api/v1/auth', authRouter);

// Note routes -->
app.use('/api/v1/notes', noteRouter);

app.use(errorMiddleware)  // error middleware

// server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// handling unhandled promise rejection
process.on("unhandledRejection",(err:any)=>{
    console.log(`Error : ${err.message}`)
    console.log("Shutting down the server due to unhandled Promise Rejection")

    server.close(()=>{
        process.exit(1);
    })
})

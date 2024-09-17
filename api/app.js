import express from "express";
// app.js
import cors from "cors";
import cookieParser from "cookie-parser";
import postRoute from './routes/post.route.js';
import authRoute from './routes/auth.route.js';
import testRoute from './routes/test.route.js';
import userRoute from './routes/user.route.js';
import dotenv from 'dotenv';

const app = express();
//  console.log("hwy gopal");

// middleware
dotenv.config();
app.use(cors({origin:process.env.CLIENT_URL,credentials:true}))
app.use(express.json());
app.use(cookieParser())
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);

app.listen(8800, ()=>{
 
    console.log("server is started at PORT 8800");
});

import express, { json } from 'express';
import { config } from 'dotenv';
import { createServer } from 'http';
import { connect } from 'mongoose';
import userRouter from "./routes/userRouter.js";
import globalErrorHandler from "./controllers/errorController.js";
import rateLimit from 'express-rate-limit';


const app = express();
const server = createServer(app);
app.use(json());


config({ path: './.env' });
const port = process.env.PORT;

connect(process.env.MONGO_URI, {}).then(() => {
    console.log('Database connected');
}).catch((err) => {
    console.log(err);
});

//I did this : rate limiting to limit login attempts in order to Prevent Brute-Force Attacks 
// when try to log in multiple times using different passwords 
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,  // Limit each IP to 5 login requests per window
    message: 'Too many login attempts. Try again in 15 minutes.',
    standardHeaders: true,  
    legacyHeaders: false,  
});

app.use('/api/users/login', loginLimiter);

app.use('/api/users', userRouter);

//GLOBAL ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandler)

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import colors from 'colors'
import { createServer } from 'http';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';


dotenv.config();

const app= express();
app.use(cors());

const server = createServer(app)
// const io = new Server(server)
//Socket(io)

app.use(express.json());

const port = process.env.PORT || 5000 ;

server.listen(port,()=>{
    console.log(`server is running in ${process.env.NODE_ENV} on port ${port}`.bgYellow);
})

app.use(notFound);

app.use(errorHandler);
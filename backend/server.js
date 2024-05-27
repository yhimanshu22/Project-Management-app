import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import colors from 'colors'
import { createServer } from 'http';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { connectDB } from './db/connectDB.js';
import images from './images.js'

dotenv.config();

connectDB()

const app= express();
app.use(cors());

const server = createServer(app)
// const io = new Server(server)
//Socket(io)

app.use(express.json());

//import routes---------------<>
import userRoutes from './routes/user.route.js'
import projectRoutes from './routes/project.route.js'

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/images', images);

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));
    app.get('*', (req, res) =>
      res.sendFile(path.resolve(__dirname, 'frontend/build/index.html'))
    );
  }

const port = process.env.PORT || 5000 ;

server.listen(port,()=>{
    console.log(`server is running in ${process.env.NODE_ENV} on port ${port}`.bgYellow);
})

app.use(notFound);

app.use(errorHandler);
import {
    authorizeSocketConnection,
    levelOneAuth} from './middleware/socketMiddleware.js';

import { socketTaskController } from './socketControllers/socketTaskController.js';
import { socketListController } from './socketControllers/socketListController.js';
import { socketProjectController } from './socketControllers/socketProjectController.js';
  

export const socket = (io) => {
    io.on('connection',async(socket)=>{
        //authorize user upon intial connection
        await authorizeSocketConnection(socket.handshake.auth,socket);
        console.log('Connected users:',io.sockets.server.eio.clientsCount);

        socket.on('join-notifications',async({room})=>{
            console.log('Joined notifications ',room);
            socket.join(room);
        })

        socket.on('join-board',async({room})=>{
            //check if user is part of the project
            await levelOneAuth({projectId:room},socket);
            console.log('Joined board',room);
            socket.join(room);
        })

        socket.on('disconnect-board',({room})=>{
            console.log('Disconnect-board',room);
            socket.leave(room);
        })

        //Task related controller
        socketTaskController(io,socket);

        //List related controller
        socketListController(io,socket);

        //project related controller
        socketProjectController(io,socket);
    })

    io.on('disconnect',(socket)=>{
        console.log('User disconnected.');
    })
    
}


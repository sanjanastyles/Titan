// import { Server } from 'socket.io';
import express from "express";
// class WebSocketServer {
//   io;
//   constructor(httpServer) {
//     this.io = new Server(httpServer);
//     this.initializeWebSocket();
//   }
//   initializeWebSocket() {
//     const io = this.io; // Store a reference to the io object
//     io.on('connection', (socket) => {
//       // Handle new connection
//       console.log('New client connected:', socket.id);
//       socket.on('disconnect', () => {
//         // Handle disconnection
//         console.log('Client disconnected:', socket.id);
//       });
//       socket.on('join-room', (roomId) => {
//         // Join a chat room
//         socket.join(roomId);
//       });
//       socket.on('message', (data) => {
//         // Broadcast message to the room
//         io.to(data.roomId).emit('message', data.message);
//       });
//     });
//   }
// }
// export default WebSocketServer;
// eslint-disable-next-line @typescript-eslint/no-var-requires

import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import Message from '../model/messageModel';
import Conversation from '../model/conversationModel';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};
const userSocketMap = {}; // userId: socketId
io.on('connection', (socket) => {
  console.log('user connected', socket.id);
  const userId = socket.handshake.query.userId;
  if (userId != 'undefined') userSocketMap[userId as string] = socket.id;
  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  socket.on('markMessagesAsSeen', async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        { conversationId: conversationId, seen: false },
        { $set: { seen: true } },
      );
      await Conversation.updateOne({ _id: conversationId }, { $set: { 'lastMessage.seen': true } });
      io.to(userSocketMap[userId]).emit('messagesSeen', { conversationId });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete userSocketMap[userId as string];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});
export { io, server, app };

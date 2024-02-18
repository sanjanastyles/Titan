import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import morgan from 'morgan';
import fs from 'fs';
import dbInit from '../dbConnection';
import CommonController from '../routes/common';
import ServiceManController from '../routes/servicemam';
import CustomerController from '../routes/customers';
import AdminController from '../routes/admin';
import Message from '../model/messageModel';
import Conversation from '../model/conversationModel';

dotenv.config();
class App {
  public app: Application;
  public io: SocketIOServer;
  public server: http.Server;
  private userSocketMap: { [userId: string]: string };
  constructor () {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    this.userSocketMap = {};
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeSocketIO();
    this.startServer();
  }

  private initializeMiddleware (): void {
    this.app.use(express.json());
    this.app.use(cors());
    const logFormat = ':method :url :status - :response-time ms';
    this.app.use(
      morgan(logFormat, {
        stream: fs.createWriteStream('./access.log', { flags: 'a' }),
      }),
    );
  }

  private initializeRoutes (): void {
    const commonController = new CommonController();
    const serviceManController = new ServiceManController();
    const customerController = new CustomerController();
    const adminController = new AdminController();
    this.app.use('/common', commonController.getRouter());
    this.app.use('/serviceman', serviceManController.getRouter());
    this.app.use('/customer', customerController.getRouter());
    this.app.use('/admin', adminController.getRouter());
  }

  private initializeSocketIO (): void {
    this.io.on('connection', (socket) => {
      const userId = socket.handshake.query.userId;
      if (userId !== 'undefined') this.userSocketMap[userId as string] = socket.id;
      this.io.emit('getOnlineUsers', Object.keys(this.userSocketMap));
      socket.on('markMessagesAsSeen', async ({ conversationId, userId }) => {
        try {
          await Message.updateMany(
            { conversationId: conversationId, seen: false },
            { $set: { seen: true } },
          );
          await Conversation.updateOne(
            { _id: conversationId },
            { $set: { 'lastMessage.seen': true } },
          );
          this.io.to(this.userSocketMap[userId]).emit('messagesSeen', { conversationId });
        } catch (error) {
          console.warn(error);
        }
      });
      socket.on('disconnect', () => {
        delete this.userSocketMap[userId as string];
        this.io.emit('getOnlineUsers', Object.keys(this.userSocketMap));
      });
    });
  }

  private startServer (): void {
    const PORT = Number(process.env.PORT) || 8000;
    dbInit();
    this.server.listen(PORT, () => {
      console.log('STARTED');
    });
  }

  public getRecipientSocketId (recipientId: string): string | undefined {
    return this.userSocketMap[recipientId];
  }
}
// Create an instance of the App class to export
const server = new App();
// Export the necessary variables and functions
export const io = server.io;
export const app = server.app;
export const serverInstance = server.server;
export const getRecipientSocketId = server.getRecipientSocketId.bind(server);

import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import morgan from 'morgan';
import fs from 'fs';
import dbInit from '../dbConnection';
import CommonController from '../routes/common';
import ServiceManController from '../routes/servicemam';
import CustomerController from '../routes/customers';
import AdminController from '../routes/admin';

dotenv.config();

class App {
  public app: Application;
  public server: http.Server;
  public io: SocketIOServer;
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
    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      if (userId) {
        this.userSocketMap[userId] = socket.id;
        this.io.emit('getOnlineUsers', Object.keys(this.userSocketMap));
      }

      socket.on('disconnect', () => {
        delete this.userSocketMap[userId];
        this.io.emit('getOnlineUsers', Object.keys(this.userSocketMap));
      });
    });
  }

  private startServer (): void {
    const PORT = Number(process.env.PORT) || 8000;
    dbInit();
    this.server.listen(PORT, () => {});
  }

  public getRecipientSocketId (recipientId: string): string | undefined {
    return this.userSocketMap[recipientId];
  }

  public emitMessageToRecipient (recipientId: string, message: any, bookingId: any): void {
    const recipientSocketId = this.getRecipientSocketId(recipientId);

    if (recipientSocketId) {
      this.io.to(bookingId).emit('newMessage', message);
    }
  }
}

// Create an instance of the App class to export
const server = new App();

// Export the necessary variables and functions
export const io = server.io;
export const app = server.app;
export const serverInstance = server.server;
export const getRecipientSocketId = server.getRecipientSocketId.bind(server);
export const emitMessageToRecipient = server.emitMessageToRecipient.bind(server);

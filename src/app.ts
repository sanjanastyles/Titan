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
import ChatbotController from '../routes/enya';

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
    const chatbotController = new ChatbotController();
    this.app.use('/common', commonController.getRouter());
    this.app.use('/serviceman', serviceManController.getRouter());
    this.app.use('/customer', customerController.getRouter());
    this.app.use('/admin', adminController.getRouter());
    this.app.use('/bot', chatbotController.getRouter());
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
    this.server.listen(PORT, () => {
      console.log('STARTED');
    });
  }

  // private startServer(): void {
  //   const PORT = Number(process.env.PORT) || 8000;
  //   // dbInit();

  //   const pythonProcess = spawn('python', ['C:\\Users\\bonam\\titan\\Titan\\enya\\enya-server\\app.py']);

  //   pythonProcess.on('error', (error) => {
  //     console.error('Error starting Python process:', error);
  //   });
  //   pythonProcess.on('data', (error) => {
  //     console.error("dd");
  //   });

  //   pythonProcess.on('exit', (code, signal) => {
  //     if (code !== 0) {
  //       console.error(`Python process exited with code ${code} and signal ${signal}`);
  //     } else {
  //       console.log('Python process exited successfully');
  //     }
  //   });
  //   this.server.listen(PORT, () => {
  //     console.log('Server started successfully');
  //   });
  // }

  public getRecipientSocketId (recipientId: string): string | undefined {
    return this.userSocketMap[recipientId];
  }

  public emitMessageToRecipient (recipientId: string, message, bookingId: string): void {
    const recipientSocketId = this.getRecipientSocketId(recipientId);

    if (recipientSocketId) {
      this.io.emit('newMessage', message);
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

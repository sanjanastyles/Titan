// server.ts
import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import dbInit from '../dbConnection';
import CommonController from '../routes/common';
import ServiceManController from '../routes/servicemam';
import CustomerController from '../routes/customers';
class App {
  private readonly app: Application;
  private readonly server: http.Server;
  private readonly io: SocketIOServer;
  constructor() {
    dotenv.config();
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: '*',
      },
    });
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeWebSocket();
    this.startServer();
  }
  private initializeMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }
  private initializeRoutes(): void {
    const commonController = new CommonController();
    const serviceManController = new ServiceManController();
    this.app.use('/common', commonController.getRouter());
    this.app.use('/serviceman', serviceManController.getRouter());
    const customerController = new CustomerController();
    this.app.use('/customer', customerController.getRouter());
  }
  private initializeWebSocket(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('disconnect', () => {
      });
      socket.on('subscribe', (channel: string) => {
        socket.join(channel);
      });
      socket.on('unsubscribe', (channel: string) => {
        socket.leave(channel);
      });
      socket.on('message', (data) => {
        const { channel, message } = data;
        socket.to(channel).emit('message', message);
      });
      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }
  private startServer(): void {
    const PORT = Number(process.env.PORT) || 8000;
    dbInit();
    this.server.listen(PORT, () => {
    });
  }
}
const server = new App();

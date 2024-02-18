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
import AdminController from '../routes/admin';
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
    const customerController = new CustomerController();
    const adminController = new AdminController();
    this.app.use('/common', commonController.getRouter());
    this.app.use('/serviceman', serviceManController.getRouter());
    this.app.use('/customer', customerController.getRouter());
    this.app.use('/admin', adminController.getRouter());
  }
  private initializeWebSocket(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('disconnect', () => {});
      socket.on('subscribe', (channel: string) => {
        socket.join(channel);
      });
      socket.on('unsubscribe', (channel: string) => {
        socket.leave(channel);
      });
      socket.on('message', (data) => {
        const { channel, message } = data;
        // socket.to(channel).emit('message', message);
        socket.emit('message', { channel: 'respond', message: message });
      });
      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }
  private startServer(): void {
    const PORT = Number(process.env.PORT) || 8000;
    dbInit();
    this.server.listen(PORT, () => {});
  }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _server = new App();

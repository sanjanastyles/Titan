// server.ts
import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';
import dbInit from '../dbConnection';
import CommonController from '../routes/common';
import ServiceManController from '../routes/servicemam';
import CustomerController from '../routes/customers';
import AdminController from '../routes/admin';
import morgan from 'morgan';
import fs from 'fs';
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
    const logFormat = ':method :url :status - :response-time ms';
    this.app.use(
      morgan(logFormat, {
        stream: fs.createWriteStream('./access.log', { flags: 'a' }),
      }),
    );
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
    this.io.use((socket, next) => {
      const username = socket.handshake.auth.username;
      console.log('FF', socket.handshake);
      if (!username) {
        return next(new Error('invalid username'));
      }
      socket['username'] = username;
      next();
    });
    // this.io.on('connection', (socket) => {
    //   // fetch existing users
    //   const users = [];
    //   for (let [id, socket] of this.io.of('/').sockets) {
    //     users.push({
    //       userID: id,
    //       username: socket['username'],
    //     });
    //   }
    //   socket.emit('users', users);
    //   // notify existing users
    //   socket.broadcast.emit('user connected', {
    //     userID: socket.id,
    //     username: socket['username'],
    //   });
    //   // forward the private message to the right recipient
    //   socket.on('private message', ({ content, to }) => {
    //     socket.to(to).emit('private message', {
    //       content,
    //       from: socket.id,
    //     });
    //   });
    //   // notify users upon disconnection
    //   socket.on('disconnect', () => {
    //     socket.broadcast.emit('user disconnected', socket.id);
    //   });
    // });
    this.io.on('connection', (socket) => {
      console.log("HERE");
      socket.on('disconnect', () => {});
      socket.on('message', (data) => {
        const { message } = data;
        this.io.emit('message', { channel: 'respond', message }); // Broadcast to all clients
      });
      socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
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
        socket.to(channel).emit('message', message);
        // socket.emit('message', { channel: 'respond', message: message });
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

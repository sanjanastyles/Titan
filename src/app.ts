import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import cors from 'cors';
import dbInit from '../dbConnection';
import CommonController from '../routes/common';
import ServiceManController from '../routes/servicemam';
import CustomerController from '../routes/customers';

class App {
  private readonly app: Application;

  constructor() {
    dotenv.config();
    this.app = express();
    this.initializeMiddleware();
    this.initializeRoutes();
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
    // Add additional controllers and routes as needed
    const customerController = new CustomerController();
    this.app.use('/customer', customerController.getRouter());
  }

  private startServer(): void {
    const PORT = Number(process.env.PORT) || 8000;
    dbInit();
    this.app.listen(PORT, () => {
      console.log(`Server Started at ${PORT}`);
    });
  }
}

const server = new App();

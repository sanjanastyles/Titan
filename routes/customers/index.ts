import express, { Router } from 'express';
import { customerController } from '../../controller';

class CustomerController {
  private router: Router;
  constructor () {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes (): void {
    this.router.post('/review', customerController.handleReviewPost);
  }

  public getRouter (): Router {
    return this.router;
  }
}
export default CustomerController;

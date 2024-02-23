import express, { Router } from 'express';
import { adminController } from '../../controller';

class AdminController {
  private router: Router;
  constructor () {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes (): void {
    this.router.get('/users', adminController.handleAllUsers);
    this.router.post('/addservice', adminController.handleAddService);
    this.router.post('/block', adminController.handleBlock);
  }

  public getRouter (): Router {
    return this.router;
  }
}
export default AdminController;

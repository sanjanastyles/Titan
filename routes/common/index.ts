import express, { Router } from 'express';
import { commonController, messageController } from '../../controller';

class CommonController {
  private router: Router;
  constructor () {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes (): void {
    this.router.post('/contact', commonController.handleContactForm);
    this.router.post('/booking', commonController.handleBooking);
    this.router.get('/allservice', commonController.handleAllService);
    this.router.get('/service/:serviceName', commonController.handleService);
    this.router.get('/profile', commonController.handleProfile);

    this.router.get('/history', commonController.handleHistory);
    this.router.get('/users/profile', commonController.getUserProfile);
    this.router.get('/delete/booking', commonController.deleteBooking);
    this.router.get('/online', commonController.handleOnline);
    this.router.get('/offline', commonController.handleOffline);
    this.router.get('/logout', commonController.handleLogOut);
    this.router.post('/get/conversation', messageController.getConversations);
    this.router.post('/forgotpassword', commonController.handleForgotPassword);
    this.router.post('/post/message', messageController.sendMessage);
  }

  public getRouter (): Router {
    return this.router;
  }
}
export default CommonController;

import express, { Router } from 'express';
import { auth } from '../../middleware';
import { serviceManController } from '../../controller';

class ServiceManController {
  private router: Router;
  constructor () {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes (): void {
    this.router.post('/login', serviceManController.handleLogin);
    this.router.post('/signup', serviceManController.handleSignup);

    this.router.get('/profile', auth, serviceManController.handleProfile);
    this.router.post('/profile', auth, serviceManController.handleProfilePost);
    this.router.get('/see/reviews', serviceManController.handleSeeReviews);
    this.router.get('/service', serviceManController.handleServiceManService);
    this.router.get('/cancel/booking', serviceManController.handleCancelBooking);
    this.router.get('/confirm/booking', serviceManController.handleConfirmBooking);
  }

  public getRouter (): Router {
    return this.router;
  }
}
export default ServiceManController;

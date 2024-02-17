/**
 * @todo - all user API
 */
import express, { Request, Response, Router } from 'express';
import { SERVICEMAN_SIGNUP_MODEL, SERVICE_MODEL } from '../../model';
// import { createToken } from "../../utils/utils";
// import { auth } from "../../middleware";
class AdminController {
  private router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get('/users', this.handleAllUsers);
    this.router.post('/addservice', this.handleAddService);
    this.router.post('/block', this.handleBlock);
    // this.router.get("/profile", auth, this.handleProfile);
    // this.router.post("/profile", auth, this.handleProfilePost);
    // this.router.get("/see/reviews", this.handleSeeReviews);
  }
  private handleBlock = async (req: Request, res: Response): Promise<void> => {
    try {
      // const userData = await SERVICEMAN_SIGNUP_MODEL.find();
      // res.status(200).json({ code: 200, msg: 'Success : User Blocked', data: userData });
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
    }
  };
  private handleAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = await SERVICEMAN_SIGNUP_MODEL.find();
      res.status(200).json({ code: 200, msg: 'Success', data: userData });
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
    }
  };
  private handleAddService = async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceName } = req.body;
      const newService = new SERVICE_MODEL({
        serviceName,
      });
      await newService.save();
      res.status(200).json({ code: 200, msg: 'Success' });
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
    }
  };
  public getRouter(): Router {
    return this.router;
  }
}
export default AdminController;

/**
 * @todo - all user API
 */
import express, { Request, Response, Router } from 'express';
import { SERVICEMAN_SIGNUP_MODEL } from '../../model';
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
    // this.router.post("/signup", this.handleSignup);
    // this.router.get("/profile", auth, this.handleProfile);
    // this.router.post("/profile", auth, this.handleProfilePost);
    // this.router.get("/see/reviews", this.handleSeeReviews);
  }
  private handleAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const pipeline: any[] = [
        {
          $lookup: {
            from: 'servicemen',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        // { $addFields: { 'user.id': '$_id' } },
        // {
        //   $project: {
        //     _id: 0,
        //     id: '$user.id',
        //     name: '$user.name',
        //     review: '$$ROOT',
        //   },
        // },
      ];
      const a = await SERVICEMAN_SIGNUP_MODEL.find();
    //   const b = await
    //   const users = await SERVICEMAN_SIGNUP_MODEL.aggregate(pipeline);
      res.status(200).json({ code: 200, msg: 'Success', data: a });
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
    }
  };
  public getRouter(): Router {
    return this.router;
  }
}
export default AdminController;

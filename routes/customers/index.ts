import express, { Request, Response, Router } from 'express';
import { REVIEW_MODEL } from '../../model';
class CustomerController {
  private router: Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post('/review', this.handleReviewPost);
  }
  private handleReviewPost = async (req: Request, res: Response) => {
    try {
      const { quality, feedback, recommend, reviewerId, associatedServiceman, associatedJob } =
        req.body;
      const newReview = new REVIEW_MODEL({
        quality,
        feedback,
        recommend,
        reviewerId,
        associatedServiceman,
        associatedJob,
      });
      await newReview.save();
      res.status(200).json({ code: 201, msg: 'Created Successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
    }
  };
  public getRouter(): Router {
    return this.router;
  }
}
export default CustomerController;

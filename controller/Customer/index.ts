import { Request, Response } from 'express';
import { REVIEW_MODEL } from '../../model';

export const handleReviewPost = async (req: Request, res: Response) => {
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

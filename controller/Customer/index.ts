import { Request, Response } from 'express';
import { ONLINEUSER_MODEL, REVIEW_MODEL } from '../../model';

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

export const getAllOnlineServiceMan = async (req: Request, res: Response) => {
  try {
    const users = await ONLINEUSER_MODEL.find({ isServiceMan: true });

    if (users.length > 0) {
      return res.status(200).json({ code: 200, message: 'Success', data: users });
    } else {
      return res.status(404).json({ code: 404, error: 'No service men found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

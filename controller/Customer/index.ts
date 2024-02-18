import { Request, Response } from 'express';
import { ONLINEUSER_MODEL, REVIEW_MODEL, SERVICEMAN_SIGNUP_MODEL } from '../../model';

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
  const data = [];
  try {
    const users = await ONLINEUSER_MODEL.find({ isServiceMan: true });
    if (users.length > 0) {
      const userIds = users.map((user) => user.userId);
      const serviceManInfo = await SERVICEMAN_SIGNUP_MODEL.find({ _id: { $in: userIds } });
      users.forEach((user) => {
        const serviceManData = serviceManInfo.find(
          (info) => info._id.toString() === user.userId.toString(),
        );
        serviceManData && data.push(serviceManData);
      });
      return res.status(200).json({ code: 200, message: 'Success', data: data });
    } else {
      return res.status(404).json({ code: 404, error: 'No service men found', data: [] });
    }
  } catch (err) {
    res.status(500).json({ error: err.message, data: [] });
  }
};

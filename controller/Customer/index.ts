import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  ONLINEUSER_MODEL,
  REVIEW_MODEL,
  SERVICEMAN_SIGNUP_MODEL,
} from '../../model';

// Helper function to send success responses
const sendSuccessResponse = (res: Response, code: number, message: string, data: any = {}) => {
  res.status(code).json({ code, message, data });
};

// Helper function to send error responses
const sendErrorResponse = (res: Response, code: number, message: string, error?: any) => {
  res.status(code).json({ code, message, error });
};

// Custom function to find all online service men
const findAllOnlineServiceMen = async () => {
  return ONLINEUSER_MODEL.find({ isServiceMan: true });
};

// Custom function to find service men by their IDs
const findServiceMenByIds = async (ids: mongoose.Types.ObjectId[]) => {
  return SERVICEMAN_SIGNUP_MODEL.find({ _id: { $in: ids } });
};

// Handle Posting Reviews
export const handleReviewPost = async (req: Request, res: Response): Promise<void> => {
  const { quality, feedback, recommend, reviewerId, associatedServiceman, associatedJob } = req.body;
  try {
    const newReview = new REVIEW_MODEL({
      quality,
      feedback,
      recommend,
      reviewerId,
      associatedServiceman,
      associatedJob,
    });
    await newReview.save();
    sendSuccessResponse(res, 201, 'Created Successfully');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err.message);
  }
};

// Get All Online Service Men
export const getAllOnlineServiceMan = async (req: Request, res: Response): Promise<void> => {
  try {
    const onlineUsers = await findAllOnlineServiceMen();
    if (onlineUsers.length === 0) {
      return sendErrorResponse(res, 404, 'No service men found');
    }

    const userIds = onlineUsers.map(user => user.userId);
    const serviceMenInfo = await findServiceMenByIds(userIds);

    sendSuccessResponse(res, 200, 'Success', serviceMenInfo);
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err.message);
  }
};

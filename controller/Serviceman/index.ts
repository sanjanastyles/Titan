
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  HISTROY_MODEL,
  SERVICEMAN_SIGNUP_MODEL,
  SERVICE_MODEL,
  REVIEW_MODEL,
  ONLINEUSER_MODEL,
  ADMIN_MODEL,
} from '../../model';
import { createToken } from '../../utils/utils';

// Helper function to send success responses
const sendSuccessResponse = (res: Response, code: number, message: string, data: any = {}) => {
  res.status(code).json({ code, message, data });
};

// Helper function to send error responses
const sendErrorResponse = (res: Response, code: number, message: string, error?: any) => {
  res.status(code).json({ code, message, error });
};

// Confirm Booking
export const handleConfirmBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const booking = await HISTROY_MODEL.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          isPending: false,
          isAccepted: true,
          isActive: true,
        },
      },
      { new: true }
    );
    booking
      ? sendSuccessResponse(res, 200, 'Booking confirmed successfully', booking)
      : sendErrorResponse(res, 412, 'Booking not found');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err.message);
  }
};

// Cancel Booking
export const handleCancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const booking = await HISTROY_MODEL.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          isPending: false,
          isCanceled: true,
          isActive: false,
        },
      },
      { new: true }
    );
    booking
      ? sendSuccessResponse(res, 200, 'Booking canceled successfully', booking)
      : sendErrorResponse(res, 404, 'Booking not found');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err.message);
  }
};

// Get Service Man Details
export const handleServiceManService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const serviceman = await SERVICEMAN_SIGNUP_MODEL.findById(id);
    serviceman
      ? sendSuccessResponse(res, 200, 'Service man found successfully', serviceman)
      : sendErrorResponse(res, 404, 'Service man not found');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err.message);
  }
};

// Login Handler
export const handleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const admin = await ADMIN_MODEL.findOne({ email });
    const user = await SERVICEMAN_SIGNUP_MODEL.findOne({ email });

    if (user && user.password === password) {
      const data = { ...user['_doc'], type: 'user' };
      sendSuccessResponse(res, 200, 'Login successful', data);
      return;
    }

    if (admin && admin.password === password) {
      const data = { ...admin['_doc'], type: 'admin' };
      sendSuccessResponse(res, 200, 'Login successful', data);
      return;
    }

    sendErrorResponse(res, 401, 'Invalid credentials');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err.message);
  }
};

// Signup Handler
export const handleSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, address, password, selectedServices, isProfessional } = req.body;
    const existingUser = await SERVICEMAN_SIGNUP_MODEL.findOne({ email });

    if (existingUser) {
      sendErrorResponse(res, 409, 'Email already registered');
      return;
    }

    const token = createToken(password + name);
    const newServiceMan = new SERVICEMAN_SIGNUP_MODEL({
      name,
      phoneNumber: phone,
      email,
      address,
      password,
      jobs: selectedServices,
      isServiceman: isProfessional,
      isBlocked: false,
      token,
      referral: 0,
    });
    await newServiceMan.save();

    await Promise.all(
      newServiceMan.jobs.map(({ name }) =>
        SERVICE_MODEL.findOneAndUpdate(
          { serviceName: name.toLowerCase() },
          { $push: { associatedServiceman: newServiceMan._id } },
          { new: true }
        )
      )
    );

    sendSuccessResponse(res, 201, 'Service man created successfully', {
      token,
      _id: newServiceMan._id,
      isServiceman: newServiceMan.isServiceman,
    });
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err.message);
  }
};

// Profile Handler
export const handleProfile = (req: Request, res: Response): void => {
  res.send({ KEY: 'profile', TOKEN: 'token' });
};

// Profile Post Handler
export const handleProfilePost = (req: Request, res: Response): void => {
  res.send({ KEY: 'profile_post', TOKEN: 'token' });
};

// See Reviews Handler
export const handleSeeReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const reviews = await REVIEW_MODEL.find({ reviewerId: id });

    const processedReviews = await Promise.all(
      reviews.map(async (review) => {
        const serviceman = await SERVICEMAN_SIGNUP_MODEL.findById(review.reviewerId);
        const booking = await HISTROY_MODEL.findById(review.associatedJob);

        return {
          id: serviceman._id,
          name: serviceman.name,
          review,
          booking,
        };
      })
    );

    sendSuccessResponse(res, 200, 'Reviews fetched successfully', processedReviews);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, 'Internal Server Error');
  }
};

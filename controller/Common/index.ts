import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  SERVICEMAN_SIGNUP_MODEL,
  REVIEW_MODEL,
  HISTROY_MODEL,
  CONTACT_MODEL,
  SERVICE_MODEL,
  ONLINEUSER_MODEL,
} from '../../model';

// Helper function for sending success responses
const sendSuccessResponse = (res: Response, statusCode: number, message: string, data?: any) => {
  res.status(statusCode).json({ code: statusCode, msg: message, data });
};

// Helper function for sending error responses
const sendErrorResponse = (res: Response, statusCode: number, message: string, error?: any) => {
  res.status(statusCode).json({ msg: message, code: statusCode, error: error?.message });
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await SERVICEMAN_SIGNUP_MODEL.findById(query)
        .select('-password -updatedAt');
    } else {
      user = await SERVICEMAN_SIGNUP_MODEL.findOne({ firstName: query })
        .select('-password -updatedAt');
    }
    if (!user) {
      sendErrorResponse(res, 404, 'User not found');
      return;
    }
    sendSuccessResponse(res, 200, 'User profile retrieved successfully', user);
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

// Delete Booking
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.query;
  try {
    const result = await HISTROY_MODEL.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      sendErrorResponse(res, 404, 'Booking not found');
      return;
    }
    sendSuccessResponse(res, 200, 'Booking deleted successfully');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

// Handle Profile
export const handleProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.query;
  try {
    const [reviews, numberOfJobs, userData] = await Promise.all([
      REVIEW_MODEL.find({ associatedServiceman: id }),
      HISTROY_MODEL.countDocuments({
        $or: [{ associatedServiceman: id }, { associatedJob: id }],
      }),
      SERVICEMAN_SIGNUP_MODEL.findById(id),
    ]);
    sendSuccessResponse(res, 200, 'Profile data found', {
      reviews,
      numberOfJobs,
      userData,
      numberOfReviews: reviews.length,
    });
  } catch (err) {
    sendErrorResponse(res, 500, 'Something went wrong', err);
  }
};

// Handle History
export const handleHistory = async (req: Request, res: Response): Promise<void> => {
  const { isServiceman, id } = req.query;
  try {
    let createHistory;
    if (isServiceman) {
      createHistory = await HISTROY_MODEL.find({
        $or: [{ associatedServiceman: { $all: id } }, { associatedCustomer: { $all: id } }],
      });
    } else {
      createHistory = await HISTROY_MODEL.find({
        associatedCustomer: { $all: id },
      });
    }
    const data = await Promise.all(createHistory.map(async (history) => {
      const { associatedServiceman } = history;
      const professional = await SERVICEMAN_SIGNUP_MODEL.findById(associatedServiceman);
      return { ...history.toObject(), professional };
    }));
    sendSuccessResponse(res, 200, 'History retrieved successfully', data);
  } catch (err) {
    sendErrorResponse(res, 500, 'Something went wrong', err);
  }
};

// Handle Booking
export const handleBooking = async (req: Request, res: Response): Promise<void> => {
  const {
    serviceName,
    associatedServiceman,
    associatedCustomer,
    address,
    phoneNumber,
    note,
    fullName,
    offerPrice,
    serviceDate,
  } = req.body;
  try {
    const existingEntry = await HISTROY_MODEL.findOne({
      serviceName,
      associatedCustomer,
      associatedServiceman,
      isCanceled: false,
    });
    if (existingEntry) {
      sendErrorResponse(res, 412, 'Entry already exists');
      return;
    }
    const createHistory = new HISTROY_MODEL({
      serviceName,
      price: parseInt(offerPrice, 10),
      associatedServiceman,
      associatedCustomer,
      address,
      customerName: fullName,
      isActive: true,
      isAccepted: false,
      isCanceled: false,
      isPending: true,
      contactNumber: parseInt(phoneNumber, 10),
      description: note,
      dateOfBooking: new Date().toISOString(),
      dateOfAppointment: serviceDate,
    });
    const result = await createHistory.save();
    sendSuccessResponse(res, 200, 'History created successfully', result);
  } catch (err) {
    sendErrorResponse(res, 500, 'Something went wrong', err);
  }
};

// Handle Contact Form
export const handleContactForm = async (req: Request, res: Response): Promise<void> => {
  const { userEmail, userName, message } = req.body;
  try {
    const createContact = new CONTACT_MODEL({
      email: userEmail,
      name: userName,
      message,
    });
    await createContact.save();
    sendSuccessResponse(res, 200, 'Contact form submitted successfully');
  } catch (err) {
    sendErrorResponse(res, 500, 'Something went wrong', err);
  }
};

// Handle All Services
export const handleAllService = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await SERVICE_MODEL.find();
    sendSuccessResponse(res, 200, 'All services retrieved successfully', services);
  } catch (err) {
    sendErrorResponse(res, 500, 'Something went wrong in getting the service', err);
  }
};

// Handle Specific Service
export const handleService = async (req: Request, res: Response): Promise<void> => {
  const { serviceName } = req.params;
  try {
    const service = await SERVICE_MODEL.findOne({
      serviceName: serviceName.toLowerCase(),
    });
    if (!service) {
      sendErrorResponse(res, 404, 'Service not found');
      return;
    }
    const servicemen = await SERVICEMAN_SIGNUP_MODEL.find({
      _id: { $in: service.associatedServiceman },
    }).select('-token');
    sendSuccessResponse(res, 200, 'Servicemen found', servicemen);
  } catch (err) {
    sendErrorResponse(res, 500, 'Something went wrong in getting the service', err);
  }
};

// Handle Forgot Password
export const handleForgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { phonenumber } = req.body;
  try {
    const user = await SERVICEMAN_SIGNUP_MODEL.findOne({ phoneNumber: phonenumber });
    if (!user) {
      sendErrorResponse(res, 404, 'User not found');
      return;
    }
    // TODO: Add password reset logic here
    sendSuccessResponse(res, 200, 'Phone number found');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

// Handle Online Status
export const handleOnline = async (req: Request, res: Response): Promise<void> => {
  const { id, isServiceMan } = req.query;
  try {
    if (!id) {
      sendErrorResponse(res, 400, 'Missing id parameter');
      return;
    }
    const existingUser = await ONLINEUSER_MODEL.findOne({ userId: id });
    if (existingUser) {
      sendErrorResponse(res, 412, 'User is already online');
      return;
    }
    const user = new ONLINEUSER_MODEL({ userId: id, isServiceMan });
    await user.save();
    sendSuccessResponse(res, 200, 'User marked as online');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

// Handle Offline Status
export const handleOffline = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.query;
  try {
    const user = await ONLINEUSER_MODEL.findOneAndDelete({ userId: id });
    if (!user) {
      sendErrorResponse(res, 404, 'User not found');
      return;
    }
    sendSuccessResponse(res, 200, 'User marked as offline');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

// Handle Log Out
export const handleLogOut = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.query;
  try {
    const user = await ONLINEUSER_MODEL.findOneAndDelete({ userId: id });
    if (!user) {
      sendErrorResponse(res, 404, 'User not found');
      return;
    }
    sendSuccessResponse(res, 200, 'User logged out successfully');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

import { Request, Response } from 'express';
import { ADMIN_MODEL, SERVICEMAN_SIGNUP_MODEL, SERVICE_MODEL } from '../../model';

// Helper function for sending a success response
const sendSuccessResponse = (res: Response, statusCode: number, message: string, data?: any) => {
  res.status(statusCode).json({ code: statusCode, msg: message, data });
};

// Helper function for sending an error response
const sendErrorResponse = (res: Response, statusCode: number, message: string, error?: any) => {
  res.status(statusCode).json({ msg: message, code: statusCode, error: error?.message });
};

// Handle Block User
export const handleBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Implement block logic
    // Example:
    // const { userId } = req.body;
    // await ADMIN_MODEL.findByIdAndUpdate(userId, { blocked: true });
    sendSuccessResponse(res, 200, 'Block functionality not yet implemented');
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

// Handle All Users
export const handleAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = await SERVICEMAN_SIGNUP_MODEL.find();
    sendSuccessResponse(res, 200, 'Success', userData);
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

// Handle Add Service
export const handleAddService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, keyWord } = req.body;
    const newService = new SERVICE_MODEL({
      serviceName: name,
      serviceId: keyWord,
    });
    await newService.save();
    sendSuccessResponse(res, 200, 'Service added successfully', newService);
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

// Handle Create Admin
export const handleCreateAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, fullName, email, phone, password } = req.body;
    const newAdmin = new ADMIN_MODEL({
      username,
      fullName,
      email,
      phoneNumber: phone,
      password,
    });
    await newAdmin.save();
    sendSuccessResponse(res, 200, 'Admin created successfully', newAdmin);
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

// Handle All Admins
export const handleAllAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await ADMIN_MODEL.find();
    sendSuccessResponse(res, 200, 'Success', admins);
  } catch (err) {
    sendErrorResponse(res, 500, 'Internal Server Error', err);
  }
};

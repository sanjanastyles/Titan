import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  SERVICEMAN_SIGNUP_MODEL,
  REVIEW_MODEL,
  HISTROY_MODEL,
  CONTACT_MODEL,
  SERVICE_MODEL,
} from '../../model';

export const getUserProfile = async (req, res) => {
  const { query } = req.query;
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await SERVICEMAN_SIGNUP_MODEL.findById({ _id: query })
        .select('-password')
        .select('-updatedAt');
    } else {
      console.log('YU', query);
      user = await SERVICEMAN_SIGNUP_MODEL.findOne({ firstName: query })
        .select('-password')
        .select('-updatedAt');
    }
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in getUserProfile: ', err.message);
  }
};
export const handleProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const [numberOfReviews, numberOfJobs, userData] = await Promise.all([
      REVIEW_MODEL.countDocuments({ $or: [{ associatedServiceman: id }, { associatedJob: id }] }),
      HISTROY_MODEL.countDocuments({
        $or: [{ associatedServiceman: id }, { associatedJob: id }],
      }),
      SERVICEMAN_SIGNUP_MODEL.findById(id),
    ]);
    res.status(200).json({
      code: 200,
      msg: 'Number of reviews found',
      data: { numberOfReviews, numberOfJobs, userData: userData },
    });
  } catch (err) {
    res.send({ msg: 'Something went wrong', code: 412, error: err });
  }
};
export const handleHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    let createHistory;
    const { isServiceman, reviewerId } = req.query;
    if (isServiceman) {
      createHistory = await HISTROY_MODEL.find({
        $or: [
          { associatedServiceman: { $all: reviewerId } },
          { associatedCustomer: { $all: reviewerId } },
        ],
      });
    } else {
      createHistory = await HISTROY_MODEL.find({
        associatedCustomer: { $all: reviewerId },
      });
    }
    res.status(200).json({ code: 200, msg: 'created', data: createHistory });
  } catch (err) {
    res.send({ msg: 'Something went wrong', code: 412, error: err });
  }
};
export const handleBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      serviceName,
      price,
      associatedServiceman,
      associatedCustomer,
      address,
      contactNumber,
      description,
      customerName,
      dateOfBooking,
      dateOfAppointment,
    } = req.body;
    // Check if an entry with the same serviceName, associatedCustomer, and associatedServiceman already exists
    const existingEntry = await HISTROY_MODEL.findOne({
      serviceName,
      associatedCustomer,
      associatedServiceman,
      isCanceled: false,
    });
    if (existingEntry) {
      res.status(412).json({ code: 412, msg: 'Entry already exists', data: {} });
    } else {
      // If no entry exists, create a new one
      const createHistory = new HISTROY_MODEL({
        serviceName,
        price: parseInt(price),
        associatedServiceman,
        associatedCustomer,
        address,
        customerName,
        isActive: true,
        isAccepted: false,
        isCanceled: false,
        isPending: true,
        contactNumber: parseInt(contactNumber),
        description,
        dateOfBooking,
        dateOfAppointment,
      });
      await createHistory.save();
      res.status(200).json({ code: 200, msg: 'History created successfully', data: {} });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Something went wrong', code: 500, error: err });
  }
};
export const handleContactForm = async (req: Request, res: Response): Promise<void> => {
  const { email, subject, message } = req.body;
  try {
    const createContact = new CONTACT_MODEL({
      email,
      subject,
      message,
    });
    await createContact.save();
    res.status(200).json({ code: 200, msg: 'created' });
  } catch (err) {
    res.send({ msg: 'Something went wrong', code: 412, error: err });
  }
};
export const handleAllService = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await SERVICE_MODEL.find();
    res.status(200).json({ code: 200, msg: 'All Service', data: services });
  } catch (err) {
    res.send({
      msg: 'Something went wrong in getting the service',
      code: 412,
      error: err,
    });
  }
};
export const handleService = async (req: Request, res: Response): Promise<void> => {
  const { serviceName } = req.params;
  try {
    const service = await SERVICE_MODEL.findOne({
      serviceName: serviceName.toLowerCase(),
    });
    if (service) {
      const servicemen = await SERVICEMAN_SIGNUP_MODEL.aggregate([
        {
          $match: { _id: { $in: service.associatedServiceman } },
        },
        {
          $project: {
            token: 0,
          },
        },
      ]);
      res.status(200).json({ code: 200, msg: 'Servicemen found', data: servicemen });
      return;
    }
    res.status(404).json({ code: 404, msg: 'Service not found' });
  } catch (err) {
    res.send({
      msg: 'Something went wrong in getting the service',
      code: 412,
      error: err,
    });
  }
};
export const handleForgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { phonenumber } = req.body;
  try {
    const user = await SERVICEMAN_SIGNUP_MODEL.findOne({
      phoneNumber: phonenumber,
    });
    if (!user) {
      res.status(404).json({ code: 404, msg: 'User not found' });
      return;
    }
    // await serviceman.updateOne(
    //   { phoneNumber: phonenumber },
    //   { $set: { password: password } }
    // );
    res.send({ code: 200, msg: 'Phone Number Found' });
  } catch (err) {
    res.status(500).send({ msg: 'Internal Server Error', code: 500, error: err });
  }
};

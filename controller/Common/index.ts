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

export const getUserProfile = async (req, res) => {
  const { query } = req.query;
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await SERVICEMAN_SIGNUP_MODEL.findById({ _id: query })
        .select('-password')
        .select('-updatedAt');
    } else {
      user = await SERVICEMAN_SIGNUP_MODEL.findOne({ firstName: query })
        .select('-password')
        .select('-updatedAt');
    }
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.query;
  let booking;
  try {
    booking = await HISTROY_MODEL.deleteOne({ _id: id }, { new: true });
    if (booking) return res.status(200).json({ code: 200, message: 'Booking Deleted' });
    if (booking) return res.status(404).json({ code: 404, error: 'Booking not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
//   export const handleHistory = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const { isServiceman, id } = req.query;

//       let aggregationPipeline = [];

//       if (isServiceman) {
//         aggregationPipeline.push(

//           {
//             $match: {
//               $or: [
//                 { associatedServiceman: { $all: id } },
//                 { associatedCustomer: { $all: id } },
//               ],
//             },
//           },

//           // {
//           //   $lookup: {
//           //     from: 'servicemen',
//           //     localField: 'associatedServiceman',
//           //     foreignField: '_id',
//           //     as: 'professional',
//           //   },
//           // }
//         );
//       } else {
//         aggregationPipeline.push(
//           {
//             $match: {
//               associatedCustomer: { $all: id },
//             },
//           }
//         );
//       }

//       let createHistory = await HISTROY_MODEL.aggregate(aggregationPipeline);

//       res.status(200).json({ code: 200, msg: 'created', data: createHistory });
//     } catch (err) {
//       res.status(412).json({ msg: 'Something went wrong', code: 412, error: err });
//     }
//   };
export const handleHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    let createHistory;
    const { isServiceman, id } = req.query;

    if (isServiceman) {
      createHistory = await HISTROY_MODEL.find({
        $or: [{ associatedServiceman: { $all: id } }, { associatedCustomer: { $all: id } }],
      });
    } else {
      createHistory = await HISTROY_MODEL.find({
        associatedCustomer: { $all: id },
      });
    }
    const data = {};
    for (let index = 0; index < createHistory.length; index++) {
      const { associatedServiceman } = createHistory[index];
      const result = await SERVICEMAN_SIGNUP_MODEL.findById(associatedServiceman);

      if (result !== null) {
        data[index] = { ...createHistory[index]['_doc'], ...{ professional: result } };
      }
    }

    res.status(200).json({ code: 200, msg: 'created', data: data });
  } catch (err) {
    res.status(412).json({ msg: 'Something went wrong', code: 412, error: err });
  }
};

export const handleBooking = async (req: Request, res: Response): Promise<void> => {
  try {
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

    const existingEntry = await HISTROY_MODEL.findOne({
      serviceName,
      associatedCustomer,
      associatedServiceman,
      isCanceled: false,
    });
    if (existingEntry) {
      res.status(412).json({ code: 412, msg: 'Entry already exists', data: {} });
    } else {
      const createHistory = new HISTROY_MODEL({
        serviceName,
        price: parseInt(offerPrice),
        associatedServiceman,
        associatedCustomer,
        address,
        customerName: fullName,
        isActive: true,
        isAccepted: false,
        isCanceled: false,
        isPending: true,
        contactNumber: parseInt(phoneNumber),
        description: note,
        dateOfBooking: new Date().toISOString(),
        dateOfAppointment: serviceDate,
      });
      const result = await createHistory.save();

      res.status(200).json({ code: 200, msg: 'History created successfully', data: result });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Something went wrong', code: 500, error: err });
  }
};
export const handleContactForm = async (req: Request, res: Response): Promise<void> => {
  const { userEmail, userName, message } = req.body;
  try {
    const createContact = new CONTACT_MODEL({
      email: userEmail,
      name: userName,
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
export const handleOnline = async (req: Request, res: Response) => {
  const { id, isServiceMan } = req.query;
  let user;
  try {
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter' });
    }
    const existingUser = await ONLINEUSER_MODEL.findOne({ userId: id });
    if (existingUser) {
      return res.status(412).json({ error: 'ALREADY THERE' });
    }
    user = new ONLINEUSER_MODEL({
      userId: id,
      isServiceMan,
    });
    await user.save();
    return res.status(200).json({ code: 200, message: 'Success' });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const handleOffline = async (req: Request, res: Response) => {
  const { id } = req.query;
  let user;
  try {
    user = await ONLINEUSER_MODEL.findOneAndDelete({ userId: id });
    if (!user) return res.status(404).json({ code: 404, error: 'User not found' });
    return res.status(200).json({ code: 200, message: 'Succes' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const handleLogOut = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    const user = await ONLINEUSER_MODEL.findOneAndDelete({ userId: id });
    if (!user) return res.status(404).json({ code: 404, error: 'User not found' });
    return res.status(200).json({ code: 200, message: 'Succes' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

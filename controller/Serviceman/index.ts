import { Request, Response } from 'express';
import {
  HISTROY_MODEL,
  SERVICEMAN_SIGNUP_MODEL,
  SERVICE_MODEL,
  REVIEW_MODEL,
  ONLINEUSER_MODEL,
  ADMIN_MODEL,
} from '../../model';
import { createToken } from '../../utils/utils';

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
      { new: true },
    );
    if (booking) {
      res.status(200).json({ code: 200, msg: 'Found successfully', data: booking });
    } else {
      res.status(412).json({ code: 412, msg: 'Not found', data: [] });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};
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
      { new: true },
    );
    if (booking) {
      res.status(200).json({ code: 200, msg: 'Found successfully', data: booking });
    } else {
      res.status(404).json({ code: 404, msg: 'Not found', data: [] });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};
export const handleServiceManService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const servicman = await SERVICEMAN_SIGNUP_MODEL.findById(id);
    if (servicman) {
      res.status(200).json({ code: 200, msg: 'Found successfully', data: servicman });
    } else {
      res.status(404).json({ code: 404, msg: 'Not found', data: [] });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};

export const handleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const admin = await ADMIN_MODEL.findOne({ email });
    const user = await SERVICEMAN_SIGNUP_MODEL.findOne({ email });

    if (user && user.password === password) {
      // const alreadyloggedin = await ONLINEUSER_MODEL.findOne({ userId: user._id });
      // if (!alreadyloggedin) {
      //   await new ONLINEUSER_MODEL({
      //     userId: user._id,
      //     isServiceMan: user.isServiceman,
      //   }).save();
      // }
      const data = { ...user["_doc"], type: 'user' }

      res.status(200).json({ code: 200, msg: 'Success', data });
      return;
    }


    if (admin && admin.password === password) {
      const data = { ...admin["_doc"], type: 'admin' }
      console.log(data, "_");
      
      res.status(200).json({ code: 200, msg: 'Success', data });
      return;
    }
    res.status(401).json({ code: 401, msg: 'Invalid credentials', data: {} });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};

export const handleSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, phone, email, address, password, selectedServices, isProfessional } = req.body;
    const existingUser = await SERVICEMAN_SIGNUP_MODEL.findOne({ email });
    if (existingUser) {
      res.status(409).json({ code: 409, msg: 'Email already registered', data: {} });
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

    newServiceMan.jobs.forEach(async ({ name }) => {
      await SERVICE_MODEL.findOneAndUpdate(
        { serviceName: name.toLowerCase() },
        { $push: { associatedServiceman: newServiceMan._id } },
        { new: true },
      );
    });
    res.status(201).json({
      code: 201,
      msg: 'Created Successfully',
      token,
      _id: newServiceMan._id,
      isServiceman: newServiceMan.isServiceman,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};
export const handleProfile = (req: Request, res: Response): void => {
  res.send({ KEY: 'profile', TOKEN: 'token' });
};
export const handleProfilePost = (req: Request, res: Response): void => {
  res.send({ KEY: 'profile_post', TOKEN: 'token' });
};
export const handleSeeReviews = async (req: Request, res: Response) => {
  // try {
  //   const { id } = req.body;
  //   const pipeline: any[] = [
  //     {
  //       $lookup: {
  //         from: 'servicemen',
  //         localField: 'reviewerId',
  //         foreignField: '_id',
  //         as: 'user',
  //       },
  //     },
  //     { $unwind: '$user' },
  //     { $addFields: { 'user.id': '$_id' } },
  //     {
  //       $project: {
  //         _id: 0,
  //         id: '$user.id',
  //         name: '$user.name',
  //         review: '$$ROOT',
  //       },
  //     },
  //   ];
  //   pipeline.push({
  //     $lookup: {
  //       from: 'services',
  //       localField: 'review.associatedJob',
  //       foreignField: '_id',
  //       as: 'booking',
  //     },
  //   });
  //   pipeline.push({ $unwind: '$service' });
  //   pipeline.push({
  //     $addFields: { 'service.id': '$review.associatedJob' },
  //   });
  //   pipeline.push({ $project: { 'review.associatedJob': 0 } });

  //   const response = await REVIEW_MODEL.aggregate(pipeline);
  //   res.status(200).json({
  //     code: 200,
  //     msg: 'Fetched Successfully',
  //     data: response,
  //   });
  // }

  try {
    const { id } = req.query;

    // Find documents matching the reviewerId
    const reviews = await REVIEW_MODEL.find({ reviewerId: id });

    // Iterate over each review to perform additional actions
    const processedReviews = await Promise.all(
      reviews.map(async (review) => {
        // Find the corresponding serviceman
        const serviceman = await SERVICEMAN_SIGNUP_MODEL.findById(review.reviewerId);

        // Find the associated service
        const booking = await HISTROY_MODEL.findById(review.associatedJob);

        // Construct the processed review object
        const processedReview = {
          id: serviceman._id, // Assuming serviceman._id is the user ID
          name: serviceman.name,
          review: review,
          booking: booking,
        };

        return processedReview;
      }),
    );

    res.status(200).json({
      code: 200,
      msg: 'Fetched Successfully',
      data: processedReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      msg: 'Internal Server Error',
    });
  }
};

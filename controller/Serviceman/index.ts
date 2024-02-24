import { Request, Response } from 'express';
import {
  HISTROY_MODEL,
  SERVICEMAN_SIGNUP_MODEL,
  SERVICE_MODEL,
  REVIEW_MODEL,
  ONLINEUSER_MODEL,
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
    const user = await SERVICEMAN_SIGNUP_MODEL.findOne({ email });
    if (user && user.password === password) {
      const alreadyloggedin = await ONLINEUSER_MODEL.findOne({ userId: user._id });
      if (!alreadyloggedin) {
        await new ONLINEUSER_MODEL({
          userId: user._id,
          isServiceMan: user.isServiceman,
        }).save();
      }
      res.status(200).json({ code: 200, msg: 'Success', data: user });
    } else {
      res.status(401).json({ code: 401, msg: 'Invalid credentials', data: {} });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};
export const handleSignup = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      passcode,
      password,
      jobs,
      signupType,
    } = req.body;
    const existingUser = await SERVICEMAN_SIGNUP_MODEL.findOne({ email });
    if (existingUser) {
      res.status(409).json({ code: 409, msg: 'Email already registered', data: {} });
      return;
    }
    const token = createToken(passcode);
    const newServiceMan = new SERVICEMAN_SIGNUP_MODEL({
      firstName,
      lastName,
      phoneNumber,
      email,
      address,
      passcode,
      password,
      isBlocked: false,
      jobs,
      isServiceman: signupType,
      token,
      referral: 0,
    });
    await newServiceMan.save();
    newServiceMan.jobs.forEach(async (e) => {
      await SERVICE_MODEL.findOneAndUpdate(
        { serviceName: e.toLowerCase() },
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
  try {
    const { isServiceman } = req.body;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = [
      {
        $lookup: {
          from: isServiceman ? 'servicemen' : 'customers',
          localField: isServiceman ? 'associatedServiceman' : 'reviewerId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $addFields: { 'user.id': '$_id' } },
      {
        $project: {
          _id: 0,
          id: '$user.id',
          name: '$user.name',
          review: '$$ROOT',
        },
      },
    ];
    // if (isServiceman) {
    pipeline.push({
      $lookup: {
        from: 'services',
        localField: 'review.associatedJob',
        foreignField: '_id',
        as: 'service',
      },
    });
    pipeline.push({ $unwind: '$service' });
    pipeline.push({
      $addFields: { 'service.id': '$review.associatedJob' },
    });
    pipeline.push({ $project: { 'review.associatedJob': 0 } });
    // }
    const response = await REVIEW_MODEL.aggregate(pipeline);
    res.status(200).json({
      code: 200,
      msg: 'Fetched Successfully',
      data: response,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};

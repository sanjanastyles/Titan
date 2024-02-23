import { Request, Response } from 'express';
import { SERVICEMAN_SIGNUP_MODEL, SERVICE_MODEL } from '../../model';

export const handleBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    // const userData = await SERVICEMAN_SIGNUP_MODEL.find();
    // res.status(200).json({ code: 200, msg: 'Success : User Blocked', data: userData });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};
export const handleAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = await SERVICEMAN_SIGNUP_MODEL.find();
    res.status(200).json({ code: 200, msg: 'Success', data: userData });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};
export const handleAddService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { serviceName } = req.body;
    const newService = new SERVICE_MODEL({
      serviceName,
    });
    await newService.save();
    res.status(200).json({ code: 200, msg: 'Success' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};

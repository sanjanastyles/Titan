import { Request, Response } from 'express';
import { ADMIN_MODEL, SERVICEMAN_SIGNUP_MODEL, SERVICE_MODEL } from '../../model';

export const handleBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    /**
     * @TODO NEED TO BE IMPLEMENTED
     */
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
    const { name, keyWord } = req.body;
    const newService = new SERVICE_MODEL({
      serviceName: name,
      serviceId: keyWord,
    });
    await newService.save();
    res.status(200).json({ code: 200, msg: 'Success' });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};

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
    res.status(200).json({ code: 200, msg: 'Success', user: newAdmin });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};

export const handleAllAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await ADMIN_MODEL.find();
    res.status(200).json({ code: 200, msg: 'Success', data: admins });
  } catch (err) {
    res.status(500).json({ msg: 'Internal Server Error', code: 500, error: err.message });
  }
};

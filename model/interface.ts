import { Types } from 'mongoose';

export interface IContact extends Document {
  email: string;
  subject: string;
  message: string;
}

export interface IService extends Document {
  serviceName: string;
  associatedServiceman: Types.ObjectId[];
}

import { Types } from 'mongoose';

export interface IContact extends Document {
  email: string;
  name: string;
  message: string;
}

export interface IService extends Document {
  serviceName: string;
  serviceId: string;
  associatedServiceman: Types.ObjectId[];
}

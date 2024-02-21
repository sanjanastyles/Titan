import { Schema, model } from 'mongoose';
import { IService } from '../interface';

const serviceSchema = new Schema<IService>(
  {
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
    },
    associatedServiceman: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Serviceman',
      },
    ],
  },
  {
    timestamps: true,
  },
);
const Service = model<IService>('Service', serviceSchema);
export default Service;

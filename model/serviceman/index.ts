import { Document, Schema, model } from 'mongoose';
// Define interface for the Serviceman document
interface IServiceman extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  address: string;
  passcode: string;
  isBlocked: boolean;
  password: string;
  jobs: string[];
  referral: number;
  jobId: string[];
  isServiceman: boolean;
  token: string;
}
// Define the Serviceman schema
const serviceManSignup = new Schema<IServiceman>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    isBlocked: {
      type: Boolean,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
    phoneNumber: {
      type: Number,
      required: [true, 'Phone number is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    passcode: {
      type: String,
      required: [true, 'Passcode is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    jobs: {
      type: [String],
      required: [true, 'Jobs are required'],
    },
    jobId: {
      type: [String],
      required: [true, 'Job IDs are required'],
    },
    isServiceman: {
      type: Boolean,
    },
    referral: {
      type: Number,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
// Define the Serviceman model
const Serviceman = model<IServiceman>('Serviceman', serviceManSignup);
export default Serviceman;

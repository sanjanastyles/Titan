import { Schema, model } from 'mongoose';

const serviceManSignup = new Schema(
  {
    name: {
      type: String,
      required: [true, 'First name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    phoneNumber: {
      type: Number,
      required: [true, 'Phone number is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    jobs: {
      type: [
        {
          name: { type: String, required: true },
          keyword: { type: String, required: true },
        },
      ],
      required: [true, 'Jobs are required'],
    },
    isServiceman: {
      type: String,
    },
    city: {
      type: String,
      required: [true, 'City is  required'],
    },

    isBlocked: {
      type: Boolean,
    },
    jobId: {
      type: [String],
      required: [true, 'Job IDs are required'],
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

const Serviceman = model('Serviceman', serviceManSignup);
export default Serviceman;

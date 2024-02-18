import mongoose, { Schema, Model } from 'mongoose';
import { IContact } from '../interface';

const contactSchema = new Schema<IContact>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    name: {
      type: String,
      required: [true, 'Subject is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
  },
  {
    timestamps: true,
  },
);

const Contact: Model<IContact> = mongoose.model('Contact', contactSchema);

export default Contact;

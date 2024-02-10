import mongoose, { Schema } from 'mongoose';

const historySchema = new Schema(
  {
    serviceName: {
      type: String,
      required: [true, 'Email is required'],
    },
    price: {
      type: Number,
      required: [true, 'Message is required'],
    },
    address: {
      type: String,
      required: [true, 'Subject is required'],
    },
    associatedServiceman: {
      type: Schema.Types.ObjectId,
      ref: 'serviceman',
    },
    associatedCustomer: {
      type: Schema.Types.ObjectId,
      ref: 'customer',
    },
  },
  {
    timestamps: true,
  },
);
const History = mongoose.model('History', historySchema);

export default History;

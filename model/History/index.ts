import mongoose, { Schema } from 'mongoose';

const historySchema = new Schema(
  {
    serviceName: {
      type: String,
      required: [true, 'serviceName is required'],
    },
    contactNumber: {
      type: Number,
      required: [true, 'contactNumber is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    dateOfBooking: {
      type: String,
      required: [true, 'Email is required'],
    },
    dateOfAppointment: {
      type: String,
      required: [true, 'Email is required'],
    },
    isCanceled: {
      type: Boolean,
      required: [true, 'Cancel is required'],
    },
    isAccepted: {
      type: Boolean,
      required: [true, 'Accept is required'],
    },
    isPending: {
      type: Boolean,
      required: [true, 'Pending is required'],
    },
    customerName: {
      type: String,
      required: [true, 'Email is required'],
    },
    isActive: {
      type: Boolean,
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

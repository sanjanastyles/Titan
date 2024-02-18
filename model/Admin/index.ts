import mongoose, { Schema } from 'mongoose';

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
    },
    phoneNumber: {
      type: Number,
      required: [true, 'phoneNumber is required'],
    },
    fullName: {
      type: String,
      required: [true, 'fullName is required'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
  },
  {
    timestamps: true,
  },
);

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;

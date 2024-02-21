import mongoose, { Schema } from 'mongoose';

const blockSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    phoneNumber: {
      type: Number,
      required: [true, 'phoneNumber is required'],
    },
    UserID: {
      type: String,
      required: [true, 'UserID is required'],
    },
  },
  {
    timestamps: true,
  },
);
const Block = mongoose.model('Block', blockSchema);
export default Block;

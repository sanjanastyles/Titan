import { Schema, model } from 'mongoose';

const onlineServiceManSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Serviceman',
    },
    isServiceMan: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);
const OnlineUser = model('OnlineUser', onlineServiceManSchema);
export default OnlineUser;

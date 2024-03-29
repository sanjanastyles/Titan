import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Serviceman' }],
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'History' },
    messages: [
      {
        text: String,
        senderName: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Serviceman' },
      },
    ],
  },
  { timestamps: true },
);
const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;

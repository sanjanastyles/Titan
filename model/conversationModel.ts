import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Serviceman' }],
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

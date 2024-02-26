import Conversation from '../../model/conversationModel';
import Message from '../../model/messageModel';
import { getRecipientSocketId, io } from '../../src/app';

async function sendMessage (req, res) {
  try {
    const { recipientId, message, senderId, senderName } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        messages: [{ text: message, sender: senderId, senderName }],
      });
      conversation = await conversation.save();
    }
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      senderName,
    });
    await newMessage.save();
    await Conversation.updateOne(
      { _id: conversation._id },
      { $push: { messages: { text: message, sender: senderId, senderName: senderName } } },
    );
    const recipientSocketId = getRecipientSocketId(conversation._id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newMessage', newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
}
async function getMessages (req, res) {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getConversations (req, res) {
  const { participants } = req.body;
  try {
    const convo = await Conversation.find({ participants: { $all: participants } });
    res.status(200).json(convo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export { sendMessage, getMessages, getConversations };

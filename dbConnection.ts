import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default function dbInit() {
  const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close soccreateCustomerkets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
  };
  const url = process.env['MONGO_URI'] ?? '';
  mongoose.connect(url, options).then(() => console.log('databse connected'));
}

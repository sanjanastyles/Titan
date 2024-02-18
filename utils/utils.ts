import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export function createToken(username) {
  const secret = process.env['JWT_SECRET'] ?? '';
  const accessToken = jwt.sign({ username: username }, secret, { expiresIn: '20m' }) ?? '';
  return accessToken;
}

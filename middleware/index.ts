import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export function auth (req, res, next) {
  const authHeader = req.headers.authorization;
  const accessTokenSecret = process.env['JWT_SECRET'] || '';
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.send({ code: 403, msg: 'Error Processing Token' });
      }
      req.body.username = user;
      next();
    });
  } else {
    res.send({ code: 401, msg: 'Forbidden' });
  }
}

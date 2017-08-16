import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.SECRET;

const token = user =>
jwt.sign({
  userId: user.id,
  userFullName: user.fullName,
  userUsername: user.username,
  userEmail: user.email,
  userRoleId: user.roleId,
}, secret, {
  expiresIn: '24h'
});

export default token;


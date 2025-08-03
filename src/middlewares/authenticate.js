import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import Session from '../models/session.js';
import User from '../models/user.js';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createError(401, 'Not authorized'));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const session = await Session.findOne({
      userId: payload.userId,
      accessToken: token,
    });

    if (!session) {
      throw createError(401, 'Session not found');
    }

    if (session.accessTokenValidUntil < new Date()) {
      throw createError(401, 'Access token expired');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    next(createError(401, err.message || 'Invalid token'));
  }
};

export default authenticate;

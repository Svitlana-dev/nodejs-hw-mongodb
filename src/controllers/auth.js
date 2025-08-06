import * as authService from '../services/auth.js';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/mailer.js';
import User from '../models/user.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const registerUser = async (req, res) => {
  const newUser = await authService.register(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

export const loginUser = async (req, res) => {
  const { accessToken, refreshToken } = await authService.login(req.body);

  res
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
};

export const refreshUserSession = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw createError(401, 'No refresh token provided');

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshSession(refreshToken);

  res
    .cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw createError(401, 'No refresh token provided');

  await authService.logout(refreshToken);

  res.clearCookie('refreshToken').status(204).send();
};

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const html = `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    `;

    await sendEmail(email, 'Reset Your Password', html);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(createError(500, `Failed to send the email: ${error.message}`));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return next(createError(401, 'Token is expired or invalid.'));
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    user.password = password;
    await user.save();

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(createError(500, `Failed to reset the password: ${error.message}`));
  }
};

export const updateUserAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let photoUrl;

    if (req.file.buffer) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'users' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            },
          );
          stream.end(req.file.buffer);
        });

      const result = await streamUpload();
      photoUrl = result.secure_url;
    } else {
      photoUrl = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { photo: photoUrl },
      { new: true },
    );

    res.status(200).json({
      status: 200,
      message: 'Photo has been successfully updated.',
      data: { photo: user.photo },
    });
  } catch (error) {
    next(createError(500, `Failed to update photo: ${error.message}`));
  }
};

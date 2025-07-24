import * as authService from '../services/auth.js';
import createError from 'http-errors';

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
      message: 'Successfully logged in an user!',
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

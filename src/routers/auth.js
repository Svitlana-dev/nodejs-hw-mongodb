import express from 'express';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  sendResetEmail,
  resetPassword,
  updateUserAvatar,
} from '../controllers/auth.js';

import validateBody from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  emailSchema,
  resetPwdSchema,
} from '../schemas/authSchemas.js';

import authenticate from '../middlewares/authenticate.js';
import { uploadUserPhoto, uploadMemory } from '../middlewares/upload.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.post('/refresh', refreshUserSession);
router.post('/logout', logoutUser);
router.post('/send-reset-email', validateBody(emailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPwdSchema), resetPassword);

router.patch(
  '/photo',
  authenticate,
  uploadUserPhoto.single('photo'),
  updateUserAvatar,
);

router.patch(
  '/photo-stream',
  authenticate,
  uploadMemory.single('photo'),
  updateUserAvatar,
);

export default router;

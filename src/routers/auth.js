import express from 'express';
import { loginUser } from '../controllers/auth.js';
import { registerUser } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { refreshUserSession } from '../controllers/auth.js';
import { logoutUser } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerUser);
router.post('/login', validateBody(loginSchema), loginUser);
router.post('/refresh', refreshUserSession);
router.post('/logout', logoutUser);

export default router;

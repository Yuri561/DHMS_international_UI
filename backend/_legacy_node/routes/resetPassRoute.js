import express from 'express';
import { resetPassword } from '../controllers/resetPassword.js';
import { config } from 'dotenv';


config()
const router = express.Router()

router.post(`/reset-password-request`, resetPassword)

export default router
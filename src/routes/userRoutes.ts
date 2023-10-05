import express from 'express';
import { getUsers, registerUser } from '../controllers/userController';

const router = express.Router();

router.route('/').post(registerUser).get(getUsers);

export default router;

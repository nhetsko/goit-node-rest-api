import express from 'express';
import contactsRouter from './contactsRouter.js';
import authRouter from './authRouter.js';
import userRouter from './userRouter.js'
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.use("/api/contacts",authenticate, contactsRouter);
router.use("/users", authRouter);
router.use("/users", authenticate, userRouter);


export default router;
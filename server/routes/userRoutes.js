import express from 'express'
import { loginUser, paymentRazorpay, registerUser, userCredits, verifyPayment } from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/credits', userAuth, userCredits);
userRouter.post('/pay-razor', userAuth, paymentRazorpay);
userRouter.post('/verify-razor', verifyPayment);

export default userRouter;
import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import razorpay from 'razorpay';
import transactionModel from "../models/transactionModel.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: 'Please enter all the details to proceed'
            })
        }

        const salt = await bcrypt.genSalt(10); // applying moderate level protection
        const hashPassword = await bcrypt.hash(password, salt);

        const userData = {
            name, email, password: hashPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({
            success: true,
            token,
            user: { name: user.name }
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'User does not exists'
            })
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.json({
                success: false,
                message: 'Invalid Credentials'
            })
        }

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({
            success: true,
            token,
            user: { name: user.name }
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);
        return res.json({
            success: true,
            credits: user.creditBalance,
            user: { name: user.name }
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const paymentRazorpay = async (req, res) => {
    try {
        const { userId, planId } = req.body;
        const userData = await userModel.findById(userId);
        if (!userId || !planId) {
            return res.json({
                success: false,
                message: 'Missing details'
            });
        }

        let credits, plan, amount, date;
        switch (planId) {
            case 'Basic':
                plan = 'Basic',
                credits = 100,
                amount = 10
                break;
            case 'Advanced':
                plan = 'Advanced',
                credits = 500,
                amount = 50
                break;
            case 'Business':
                plan = 'Business',
                credits = 5000,
                amount = 250
                break;
            default:
                return res.json({
                    success: false,
                    message: 'Plan not found'
                })
        }
        date = Date.now();

        const transactionData = { userId, plan, amount, credits, date }
        const newTransaction = await transactionModel.create(transactionData);

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id
        }
        await razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                return res.json({
                    success: false,
                    message: error
                })
            }

            res.json({
                success: true,
                order
            })
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}
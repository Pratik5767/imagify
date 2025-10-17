import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
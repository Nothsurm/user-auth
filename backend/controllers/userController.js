import User from "../models/userModel.js";
import VerifyToken from "../models/verifyTokenModel.js";
import bcrypt from 'bcryptjs'
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { generateToken } from '../utils/createToken.js';
import { generateOTP, sendEmail } from "../utils/email.js";
import { isValidObjectId } from "mongoose";

export const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body
    
    if (!username || !email || !password) {
        throw new Error('Please fill all the fields')
    }

    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400).send('User already exists')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({
        username, 
        email, 
        password: hashedPassword
    })

    const OTP = generateOTP()
    const verificationToken = new VerifyToken({
        owner: newUser._id,
        token: OTP
    })
        await verificationToken.save()
        await newUser.save()
        generateToken(res, newUser._id)

        await sendEmail({
            email: newUser.email,
            subject: 'Verify your email account',
            message: `${OTP}`
        });

        res.send(newUser)

});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({email})

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)

        if (isPasswordValid) {
            generateToken(res, existingUser._id)

            res.status(200).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin
            })
        } else {
            res.status(401).json({ message: 'Invalid Password'})
        }
    } else {
        res.status(401).json({ message: 'User not found'})
    }
});

export const verifyEmail = asyncHandler(async (req, res) => {
    const {userId, otp} = req.body
    if (!userId || !otp.trim()) {
        throw new Error('Invalid request, missing parameters')
    }

    if(!isValidObjectId(userId)) {
        throw new Error('Invalid user')
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new Error('User not found')
    }
    if (user.verified) {
        throw new Error('This User is already verified')
    }

    const token = await VerifyToken.findOne({owner: user._id})
    if (!token) {
        throw new Error('User not found')
    }

    const isMatched = await token.compareToken(otp)
    if (!isMatched) {
        throw new Error('Please provide a valid token')
    }

    user.verified = true;
    
    try {
        await VerifyToken.findByIdAndDelete(token._id)
        await user.save()

        await sendEmail({
            from: 'emailverification@email.com',
            email: user.email,
            subject: 'Email verified successfully',
            message: `Your Email Verified Successfully`
        });

        res.status(200).json({message: 'Email successfully verified'})
    } catch (error) {
        res.status(404)
        throw new Error('Something went wrong')
    }

})

export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })

    res.status(200).json({ message: 'Logout Successfull' })
});

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            user.password = hashedPassword
        }
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
});

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        await User.deleteOne({ _id: user._id })
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0)
        })
        res.json({ message: 'User successfully deleted' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})


//Requires Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
});

//Reset Password
export const forgotPassword = asyncHandler(async(req, res) => {
    // Get user based on posted email
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        res.status(404)
        throw new Error('This Email hasnt been created')
    } 

    const resetToken = user.createPasswordResetToken()

    await user.save()

    //send the token back to the user email
    const resetUrl= `${req.protocol}://localhost:5173/resetPassword/${resetToken}`
    const message = `We have received a password reset request. Please use the link below to reset your password\n\n${resetUrl}\n\nThis password Link will be valid for only 10 minutes`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password change request',
            message: message,
        });

        res.status(200).json({
            _id: user._id,
            passwordResetToken: user.passwordResetToken
        })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        user.save({validateBeforeSave: false})

        return err.message
    }
})

export const resetPassword = asyncHandler(async(req, res) => {
    if(!req.body.password) {
        res.status(403)
        throw new Error('Please enter a password')
    }
    if (!req.params.token) {
        res.status(403)
        throw new Error('User not found, token expired!')
    } else {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)

            const user = await User.findOneAndUpdate({
                passwordResetToken: req.params.token, 
                passwordResetTokenExpires: {$gt: Date.now()}
            }, {
                $set: {
                    password: hashedPassword,
                    passwordResetToken: undefined,
                    passwordResetTokenExpires: undefined
                }
            }, {new: true})
            const { password, ...rest } = user._doc
            res.status(200).json({ message: "Password successfully reset" })
        } catch (error) {
            res.status(404)
            throw new Error({ message: error.message})
        }
    }
})


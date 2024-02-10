import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { generateToken } from '../utils/createToken.js';
import { sendEmail } from "../utils/email.js";

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
    
    try {
        await newUser.save()
        generateToken(res, newUser._id)

        res.status(200).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        })
    } catch (error) {
        res.status(400)
        throw new Error('Invalid User Data')
    }
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
    await user.save({validateBeforeSave: false})

    //send the token back to the user email
    const resetUrl= `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`
    const message = `We have received a password reset request. Please use the link below to reset your password\n\n${resetUrl}\n\nThis password Link will be valid for only 10 minutes`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password change request',
            message: message,
        });

        res.status(200).json({ message: 'Password reset link sent to the user' })
    } catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetTokenExpires = undefined
        user.save({validateBeforeSave: false})

        return err.message
    }
})

export const resetPassword = asyncHandler(async(req, res) => {
    const user = await User.findOne({
        passwordResetToken: req.params.token, 
        passwordResetTokenExpires: {$gt: Date.now()}
    })
    console.log(user);

    if (!user) {
        res.status(403)
        throw new Error('User not found, token expired!')
    } else {
        try {
            user.password = req.body.password
            user.confirmPassword = req.body.confirmPassword
            user.passwordResetToken = undefined
            user.passwordResetTokenExpires = undefined

            user.save();

            //Login user
            generateToken(res, user._id)

            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin
            })
        } catch (error) {
            res.status(404)
            throw new Error({ message: error.message})
        }
    }
})


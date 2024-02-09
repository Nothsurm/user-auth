import mongoose from "mongoose";
import bcryptjs from 'bcryptjs'

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpires: {
        type: Date
    }
}, {timestamps: true});

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = bcryptjs.hashSync(process.env.VITE_PASSWORD_RESET_TOKEN, 2).toString()

    this.passwordResetToken = bcryptjs.hashSync(process.env.VITE_PASSWORD_RESET_TOKEN, 10).toString()
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

    return resetToken;
}

const User = mongoose.model('User', userSchema)

export default User;
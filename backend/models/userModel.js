import mongoose from "mongoose";

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
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function resetToken(length) {
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    this.passwordResetToken = resetToken(10)
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

    return this.passwordResetToken
}

const User = mongoose.model('User', userSchema)

export default User;
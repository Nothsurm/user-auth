import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const verifyTokenSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    }
});

verifyTokenSchema.pre('save', async function (next) {
    if (this.isModified('token')) {
        const hash = await bcrypt.hash(this.token, 8)
        this.token = hash
    }
    next()
})

verifyTokenSchema.methods.compareToken = async function (token) {
    const result = await bcrypt.compareSync(token, this.token)
    return result;
}

const VerifyToken = mongoose.model('VerifyToken', verifyTokenSchema)

export default VerifyToken;
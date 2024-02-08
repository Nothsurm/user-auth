import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.VITE_DATABASE)
        console.log(`Successfully connected to the Database`);
    } catch (error) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}
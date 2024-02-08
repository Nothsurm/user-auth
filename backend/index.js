import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'

import { connectDB } from './config/db.js'
import userRoutes from './routes/userRoutes.js'

// Configuration
dotenv.config()
connectDB()

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

const PORT = process.env.VITE_PORT || 5000

// Routes
app.use('/api/users', userRoutes)

// Connect to Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

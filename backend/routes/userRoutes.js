import express from 'express'
import { createUser, loginUser, logoutUser, getAllUsers, getUserProfile, updateUserProfile, deleteUser, forgotPassword, resetPassword } from '../controllers/userController.js';

// Middlewares
import { authenticate, authorizedAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router()

router.route('/').post(createUser).get(authenticate, authorizedAdmin, getAllUsers)
router.post('/auth', loginUser)
router.post('/logout', logoutUser)
router.route('/profile').get(authenticate, getUserProfile).put(authenticate, updateUserProfile)
router.delete('/profile/:id',authenticate, deleteUser)

//Forgot Password routes
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:token').patch(resetPassword)

export default router;
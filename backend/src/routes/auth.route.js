import express from 'express';
import multer from 'multer';
import { signup, login, logout, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';



const storage = multer.memoryStorage();
const upload = multer({ storage });


const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.put('/update-profile', protectRoute, upload.single("profilepic"), updateProfile);

router.get('/check', protectRoute, checkAuth);







export default router;



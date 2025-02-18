import express from 'express';
//import multer from 'multer';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUsersForSidebar, getMessages, sendMessage } from '../controllers/message.controller.js';


//const storage = multer.memoryStorage();
//const upload = multer({ storage });


const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);


export default router;
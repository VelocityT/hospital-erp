import express from 'express';
const router = express.Router();
import { registerUser, getUsers} from '../controllers/user.controller.js';

router.post('/register', registerUser);


router.get("/",getUsers)


export default router;

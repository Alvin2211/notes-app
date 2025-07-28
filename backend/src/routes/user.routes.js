import { Router } from 'express';
import {registerUser, loginUser, logoutUser} from '../controllers/users.controllers.js';
import{ verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
//register route 
router.route('/register').post(registerUser);

//login route
router.route('/login').post(loginUser);

//logout user route 
router.route("/logoutUser").post(verifyJWT, logoutUser);


export default router;


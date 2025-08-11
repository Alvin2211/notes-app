import { Router } from 'express';
import {registerUser, loginUser, logoutUser,getCurrentUser, refreshAccessToken} from '../controllers/users.controllers.js';
import{ verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();
//register route 
router.route('/register').post(registerUser);

//login route
router.route('/login').post(loginUser);

//logout user route 
router.route('/logout').post(verifyJWT, logoutUser);

router.route('/current-user').get(verifyJWT, getCurrentUser);

//refresh access token route
router.route('/refresh-token').post(refreshAccessToken);

export default router;


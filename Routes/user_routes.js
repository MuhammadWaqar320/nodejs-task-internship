import express from 'express';
import {rateLimiter,auth} from '../MiddleWares/AuthMiddleWare.js';
import { userRegistrationValidation ,actorsValidations,reviewsValidations} from '../MiddleWares/validations.js';
import { createUser,loginUser,logoutUser,activateUserEmail,forgetpassword,resetPassword } from '../Controllers/user_controllers.js';
const user_router=express.Router();


// user's routes are here
user_router.get('/logout',auth,logoutUser)
user_router.post('/add',userRegistrationValidation,createUser)
user_router.post('/login',rateLimiter,loginUser)
user_router.get('/activate/:token',activateUserEmail)
user_router.post('/forgetpassword',forgetpassword)
user_router.put('/reset/:token',resetPassword)
export default user_router;
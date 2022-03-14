import express from 'express';
import { createActors ,getAllActors,deleteActors, updateActors, getActorsById,calculateBusiness,updateProfile,getDataFromApi} from '../Controllers/actors_controllers.js';
import { userRegistrationValidation ,actorsValidations,reviewsValidations} from '../MiddleWares/validations.js';
import {rateLimiter,auth,auth0} from '../MiddleWares/AuthMiddleWare.js';
import serviceAccount from '../FirebaseServices/firebase.js';
import multer from 'multer';
const storage=multer.diskStorage(
    {
        destination:'./Upload/actorsProfile',
        filename:(req,file,cb)=>
        {
            return cb(null,file.originalname)
        }
    }
    
)
const actorsProfileImages=multer(
    {
        storage:storage,
        limits:{fileSize:1000000}
    }
)
// for firebase storage
const upload=multer(
    {
        storage:multer.memoryStorage()
    }
)
const actor_router=express.Router();

// actor_router.post('/add',actorsProfileImages.single('profile'),actorsValidations,createActors)
actor_router.post('/add',upload.single('profile'),actorsValidations,createActors)

actor_router.get('/get',getAllActors)
actor_router.get('/actorsgetbyid/:id',auth0,getActorsById)
actor_router.delete('/actorsDelete/:id',deleteActors)
actor_router.put('/actorsUpdate/:id',updateActors)
actor_router.get('/businessByActor/:id',calculateBusiness)
// actor_router.put('/updateProfile/:id',actorsProfileImages.single('profile'),updateProfile)
actor_router.get('/getDataFromDummyApi',getDataFromApi)
export default actor_router;
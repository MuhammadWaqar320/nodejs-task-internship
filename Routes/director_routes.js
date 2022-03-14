import express from 'express';
import {rateLimiter,auth} from '../MiddleWares/AuthMiddleWare.js';
import { createDirector,deleteDirector,getAllDirector, updateDirector,directorGetById} from '../Controllers/director_controller.js';
const director_router=express.Router();
// director's routes are here
director_router.post('/add',createDirector)
director_router.get('/get',getAllDirector)
director_router.delete('/directorDelete/:id',deleteDirector)
director_router.put('/directorUpdate/:id',updateDirector)
director_router.get('/directorGetById/:id',directorGetById)
export default director_router;
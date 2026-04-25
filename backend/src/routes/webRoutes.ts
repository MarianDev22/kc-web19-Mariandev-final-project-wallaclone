import express from 'express'
import { createAdvertController } from '../controllers/products/createAdvertController';


export const webRouter = express.Router();

//Product/Ad Routes
webRouter.post('/', createAdvertController);
//webRouter.get('/login', getAdsController);
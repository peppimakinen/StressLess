import express from 'express';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {getAllUserData, getToday} from '../controllers/kubios-controller.mjs';

// eslint-disable-next-line new-cap
const kubiosRouter = express.Router();

kubiosRouter
    .get('/user-data', authenticateToken, getAllUserData)
    .get('/daily', authenticateToken, getToday);

export default kubiosRouter;

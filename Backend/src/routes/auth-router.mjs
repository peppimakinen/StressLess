import {validationErrorHandler} from '../middlewares/error-handler.mjs';
import {patientPostLogin,
  getMe} from '../controllers/patient-auth-controller.mjs';
import {doctorPostLogin} from '../controllers/doctor-auth-controller.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body} from 'express-validator';
import express from 'express';

// eslint-disable-next-line new-cap
const authRouter = express.Router();

authRouter
    .post(
        '/patientlogin',
        body('username').trim().isEmail(),
        body('password').trim().isLength({min: 3, max: 128}),
        validationErrorHandler,
        patientPostLogin,
    )
    .post(
        '/doctorlogin',
        body('username').trim().isEmail(),
        body('password').trim().isLength({min: 3, max: 128}),
        validationErrorHandler,
        doctorPostLogin,
    );

authRouter.get('/me', authenticateToken, getMe);

export default authRouter;

/* eslint-disable max-len */
import {
  onlyForDoctorHandler,
  onlyForPatientHandler,
  validationErrorHandler,
} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body, param} from 'express-validator';
import express from 'express';
import {
  postDoctor,
  deleteSelf,
  formPair,
  getDoctor,
  getPatients,
} from '../controllers/user-controller.mjs';

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter
  .route('/')
  .delete(
    authenticateToken,
    body('confirmation_password').isLength({min: 3, max: 60}).trim(),
    validationErrorHandler,
    deleteSelf,
  );

userRouter
  .route('/find-doctor/:doctor_username')
  .get(
    authenticateToken,
    onlyForPatientHandler,
    param('doctor_username', 'Invalid username for doctor').isEmail().trim(),
    validationErrorHandler,
    getDoctor,
  );

userRouter
  .route('/create-pair')
  .post(
    authenticateToken,
    onlyForPatientHandler,
    body('doctor_username', 'Doctor username should be their email').isEmail(),
    validationErrorHandler,
    formPair,
  );
userRouter
  .route('/doctor/available-patients')
  .get(
    authenticateToken,
    onlyForDoctorHandler,
    getPatients,
  );
// Only for application admin - authentication done with a enviorment variable
userRouter
  .route('/create-doctor')
  .post(body('username', 'Invalid email address').trim().isEmail(), postDoctor);

export default userRouter;

import {authenticateToken} from '../middlewares/authentication.mjs';
import {
  onlyForPatientWhoCompletedSurvey,
  onlyForPatientHandler,
  validateSurvey,
  onlyForDoctorHandler,
  verifyRightToViewPatientsData,
  validationErrorHandler,
} from '../middlewares/error-handler.mjs';
import {
  getOwnSurvey,
  postSurvey,
  getActivities,
  getPatientSurvey,
} from '../controllers/survey-controller.mjs';
import express from 'express';
import {param} from 'express-validator';

const surveyRouter = express.Router();

surveyRouter
  .route('/')
  .get(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    getOwnSurvey,
  )
  .post(authenticateToken, onlyForPatientHandler, validateSurvey, postSurvey);

surveyRouter
  .route('/activities')
  .get(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    getActivities,
  );
surveyRouter
  .route('/doctor/:patient_id')
  .get(
    authenticateToken,
    onlyForDoctorHandler,
    param('patient_id', 'Invalid patient ID').isInt(),
    validationErrorHandler,
    verifyRightToViewPatientsData,
    getPatientSurvey,
  );
export default surveyRouter;

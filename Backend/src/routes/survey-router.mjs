import {authenticateToken} from '../middlewares/authentication.mjs';
import {
  onlyForPatientWhoCompletedSurvey,
  onlyForPatientHandler,
  validateSurvey,
} from '../middlewares/error-handler.mjs';
import {
  getOwnSurvey,
  postSurvey,
  getActivities,
} from '../controllers/survey-controller.mjs';
import express from 'express';

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
export default surveyRouter;

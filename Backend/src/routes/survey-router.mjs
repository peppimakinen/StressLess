import {authenticateToken} from '../middlewares/authentication.mjs';
import {
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
  .get(authenticateToken, onlyForPatientHandler, getOwnSurvey)
  .post(authenticateToken, onlyForPatientHandler, validateSurvey, postSurvey);

surveyRouter
  .route('/activities')
  .get(authenticateToken, onlyForPatientHandler, getActivities);
export default surveyRouter;

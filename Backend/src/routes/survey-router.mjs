import {authenticateToken} from '../middlewares/authentication.mjs';
import {
  onlyForPatientHandler,
  validateSurvey,
} from '../middlewares/error-handler.mjs';
import {getOwnSurvey, postSurvey} from '../controllers/survey-controller.mjs';
import express from 'express';

const surveyRouter = express.Router();

surveyRouter
  .route('/')
  .get(authenticateToken, onlyForPatientHandler, getOwnSurvey)
  .post(authenticateToken, onlyForPatientHandler, validateSurvey, postSurvey);

export default surveyRouter;

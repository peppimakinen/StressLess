import {authenticateToken} from '../middlewares/authentication.mjs';
import {onlyForPatientHandler} from '../middlewares/error-handler.mjs';
import {getOwnSurvey} from '../controllers/survey-controller.mjs';
import express from 'express';

const surveyRouter = express.Router();

surveyRouter
  .route('/')
  .get(authenticateToken, onlyForPatientHandler, getOwnSurvey);

export default surveyRouter;

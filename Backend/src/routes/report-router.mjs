import {
  onlyForPatientHandler,
  validationErrorHandler,
  onlyForPatientWhoCompletedSurvey,
} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body, param} from 'express-validator';
import {getAvailableWeeks} from '../controllers/report-controller.mjs';
import express from 'express';

// eslint-disable-next-line new-cap
const reportRouter = express.Router();

reportRouter
  .route('/available-weeks')
  .get(authenticateToken, getAvailableWeeks);

export default reportRouter;

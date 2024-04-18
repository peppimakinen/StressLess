import {
  validationErrorHandler,
  onlyForPatientWhoCompletedSurvey,
} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {param} from 'express-validator';
import {
  getAvailableWeeks,
  getSpecificReport,
} from '../controllers/report-controller.mjs';
import express from 'express';

// eslint-disable-next-line new-cap
const reportRouter = express.Router();
reportRouter
  .route('/available-weeks')
  .get(authenticateToken, onlyForPatientWhoCompletedSurvey, getAvailableWeeks);

reportRouter
  .route('/:report_id')
  .get(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    param('report_id').isInt(),
    validationErrorHandler,
    getSpecificReport,
  );

export default reportRouter;

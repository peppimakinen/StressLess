import {
  validationErrorHandler,
  onlyForPatientWhoCompletedSurvey,
  validateMondayAndSundayDates,
} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body} from 'express-validator';
import {
  getAvailableWeeks,
  getWeeklyReport,
} from '../controllers/report-controller.mjs';
import express from 'express';

// eslint-disable-next-line new-cap
const reportRouter = express.Router();
reportRouter
  .route('/')
  .get(authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    body('week_start_date', 'Date should be in yyyy-mm-dd format').isDate(),
    body('week_end_date', 'Date should be in yyyy-mm-dd format').isDate(),
    validationErrorHandler,
    validateMondayAndSundayDates,
    getWeeklyReport,
  );
reportRouter
  .route('/available-weeks')
  .get(authenticateToken, getAvailableWeeks);

export default reportRouter;

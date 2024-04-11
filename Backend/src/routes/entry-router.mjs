import {
  onlyForPatientHandler,
  validationErrorHandler,
  onlyForPatientWhoCompletedSurvey,
} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body, param} from 'express-validator';
import express from 'express';
import {
  postEntry,
  getMonth,
  getDay,
} from '../controllers/entry-controller.mjs';

// eslint-disable-next-line new-cap
const entryRouter = express.Router();

entryRouter
  .route('/')
  .post(
    authenticateToken,
    onlyForPatientHandler,
    onlyForPatientWhoCompletedSurvey,
    body('entry_date', 'Date should be in yyyy-mm-dd format').isDate(),
    body('mood_color').isString(),
    body('notes').isString(),
    validationErrorHandler,
    postEntry,
  );

entryRouter
  .route('/monthly')
  .get(
    authenticateToken,
    body('year', 'Only the years between 2020 - 2030 are available').isInt({
      min: 2020,
      max: 2030,
    }),
    body('month', 'Provide a month number').isInt({min: 1, max: 12}),
    validationErrorHandler,
    getMonth,
  );

entryRouter
  .route('/daily/:entry_date')
  .get(
    authenticateToken,
    onlyForPatientHandler,
    onlyForPatientWhoCompletedSurvey,
    param('entry_date', 'Date should be in yyyy-mm-dd format').isDate(),
    validationErrorHandler,
    getDay,
  );

export default entryRouter;

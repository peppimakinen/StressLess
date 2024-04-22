import {
  validationErrorHandler,
  onlyForPatientWhoCompletedSurvey,
} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body, param, query} from 'express-validator';
import express from 'express';
import {
  postEntry,
  getMonth,
  putEntry,
  getDay,
} from '../controllers/entry-controller.mjs';

// eslint-disable-next-line new-cap
const entryRouter = express.Router();

entryRouter
  .route('/')
  .post(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    body('entry_date', 'Date should be in yyyy-mm-dd format').isDate(),
    body('mood_color').isString(),
    body('notes').isString(),
    validationErrorHandler,
    postEntry,
  )
  .put(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    body('entry_date', 'Date should be in yyyy-mm-dd format').isDate(),
    body('mood_color').isString(),
    body('notes').isString(),
    validationErrorHandler,
    putEntry,
  );

entryRouter
  .route('/monthly')
  .get(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    query('year', 'Only the years between 2020 - 2030 are available').isInt({
      min: 2020,
      max: 2030,
    }),
    query('month', 'Provide a month number').isInt({min: 1, max: 12}),
    validationErrorHandler,
    getMonth,
  );

entryRouter
  .route('/daily/:entry_date')
  .get(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    param('entry_date', 'Date should be in yyyy-mm-dd format').isDate(),
    validationErrorHandler,
    getDay,
  );

export default entryRouter;

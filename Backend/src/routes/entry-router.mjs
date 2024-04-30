import {
  validationErrorHandler,
  onlyForPatientWhoCompletedSurvey,
  onlyForDoctorHandler,
  verifyRightToViewPatientsData,
} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body, param, query} from 'express-validator';
import express from 'express';
import {
  postEntry,
  getMonth,
  putEntry,
  getDay,
  getPatientMonth,
  getPatientDay,
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
/**
 * @api {put} api/entries/monthly?month=__&year=__ Get month with entries
 * @apiVersion 1.0.0
 * @apiName getMonth
 * @apiGroup Entries
 * @apiPermission onlyPatients
 *
 * @apiDescription Retrieve and append entry data to dates in the chosen month if available
 *
 * @apiParam {Int} Month Month number with leading zero if needed.
 * @apiParam {Int} Year Year between 2020-2030
 *
 * @apiSuccess {Dictionary} Key-value pairs for each date in the selected month, with entry data if available
 *
 * @apiSuccessExample Success-Response containing entries:
 *    HTTP/1.1 200 OK
 *         {
 *             "2024-02-01": {},
 *             "2024-02-02": {},
 *             "2024-02-03": {},
 *              ...
 *             "2024-02-14": {
 *                   "user_id": 1,
 *                    "entry_id": 6,
 *                    "entry_date": "2024-02-14",
 *                    "mood_color": "FFF67E",
 *                    "notes": "Entry for week 7",
 *                    "measurement_id": 6,
 *                    "measurement_date": "2024-02-14",
 *                    "mean_hr_bpm": "71.09",
 *                    "sns_index": "0.62",
 *                    "pns_index": "-0.94",
 *                    "stress_index": "10.67",
 *                    "all_activities": [
 *                              "Hiking",
 *                               "Swimming",
 *                               "Meditation"
 *                     ]
 *              },
 *               ...
 *              "2024-02-29": {}
 *          }
 *
 * @apiSuccessExample Success-Response not containing entries:
 *    HTTP/1.1 200 OK
 *         {
 *             "2024-02-01": {},
 *             "2024-02-02": {},
 *             "2024-02-03": {},
 *               ...
 *              "2024-02-29": {}
 *          }
 *
 * @apiUse YearNotInReachError
 * @apiUse InvalidUrlParameterForEntriesError
 * @apiUse OnlyForPatientsError
 * @apiUse SurveyNotCompletedError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */
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
entryRouter.route('/doctor/daily/:entry_date/:patient_id').get(
  authenticateToken,
  onlyForDoctorHandler,
  param('patient_id', 'Invalid patient ID').isInt(),
  param('entry_date', 'Entry date should be in yyyy-mm-dd format').isDate(),
  validationErrorHandler,
  verifyRightToViewPatientsData,
  getPatientDay,
);
entryRouter.route('/doctor/monthly/:patient_id').get(
  authenticateToken,
  onlyForDoctorHandler,
  param('patient_id', 'Invalid patient ID').isInt(),
  query('year', 'Only the years between 2020 - 2030 are available').isInt({
    min: 2020,
    max: 2030,
  }),
  query('month', 'Provide a month number').isInt({min: 1, max: 12}),
  validationErrorHandler,
  verifyRightToViewPatientsData,
  getPatientMonth,
);

export default entryRouter;

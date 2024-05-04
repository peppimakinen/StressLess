/* eslint-disable max-len */
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body, param, query} from 'express-validator';
import express from 'express';
import {
  onlyForPatientWhoCompletedSurvey,
  verifyRightToViewPatientsData,
  validationErrorHandler,
  onlyForDoctorHandler,
} from '../middlewares/error-handler.mjs';
import {
  getPatientMonth,
  getPatientDay,
  postEntry,
  getMonth,
  putEntry,
  getDay,
} from '../controllers/entry-controller.mjs';

const entryRouter = express.Router();

/**
 * @apiDefine InvalidEntrySyntax
 * @apiError InvalidEntrySyntax Invalid syntax for postEntry
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Invalid entry_date",
 *         "status": 400
 *         "errors": [
 *             {
 *                "field":"entry_date",
 *                "message":"Date should be in yyyy-mm-dd format"
 *             }
 *         ]
 *       }
 *     }
 */
/**
 * @apiDefine YearNotInReachError
 * @apiError YearNotInReachError Request URL year is out of defined limits
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Bad Request",
 *         "status": 400
 *         "errors": [
 *             {
 *                "field":"year",
 *                "message":"Only the years between 2020 - 2030 are available"
 *             }
 *         ]
 *       }
 *     }
 */
/**
 * @apiDefine InvalidUrlParameterForEntriesError
 * @apiError InvalidUrlParameterForEntriesError Invalid URL parameter
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Bad Request",
 *         "status": 400
 *         "errors": [
 *             {
 *                "field":"month",
 *                "message":"Provide a month number"
 *             }
 *         ]
 *       }
 *     }
 */
/**
 * @apiDefine InvalidMoodColorError
 * @apiError InvalidMoodColorError Invalid HEX value in mood_color
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Invalid mood color",
 *         "status": 400
 *         "errors": "Available HEX values: 9BCF53,FFF67E,FF8585,D9D9D9"
 *            }
 *       }
 *     }
 */
/**
 * @apiDefine ExistingEntryError
 * @apiError ExistingEntryError There already exists entry for the selected date
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "error": {
 *         "message": "There is a existing entry for this date already",
 *         "status": 409
 *         "errors": "One entry per day"
 *            }
 *       }
 *     }
 */
/**
 * @apiDefine NoKubiosDataError
 * @apiError NoKubiosDataError Attempting to access postEntry for a date lacking HRV data.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "No kubios data found",
 *         "status": 400
 *            }
 *       }
 *     }
 */
/**
 * @apiDefine NoEntryToModifyError
 * @apiError NoKubiosDataError Attempting to modify entry that doesnt exist
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": {
 *         "message":  "No entry found with entry_date=2024-01-01",
 *         "status": 404
 *            }
 *       }
 *     }
 */
/**
 * @api {post} api/entries New entry
 * @apiVersion 1.0.0
 * @apiName postEntry
 * @apiGroup Entries
 * @apiPermission onlyPatients
 *
 * @apiDescription Post a new diary entry for a day that contains HRV data
 *
 * @apiParam {Date} Entry_date Entry date in yyyy-mm-dd format
 * @apiParam {String} Mood_color HEX value for color to describe mood: green (9BCF53), yellow (FFF67E), red (FF8585) or gray (D9D9D9)
 * @apiParam {List} Activities List of activities performed that day
 * @apiParam {Text} Notes Brief optional description of the day
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "entry_date": "2024-01-01",
 *      "mood_color": ""
 *      "activities": ['Meditation', 'Listening to music']
 *      "notes": "Started a baking class today!"
 *    }
 *
 * @apiSuccess {String} message Message for successful operation
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *        {
 *           "message": "New entry_id=1"
 *        }
 *
 * @apiUse ExistingEntryError
 * @apiUse InvalidActivityError
 * @apiUse MissingActivitiesListError
 * @apiUse NoKubiosDataError
 * @apiUse InvalidEntrySyntax
 * @apiUse InvalidMoodColorError
 * @apiUse OnlyForPatientsError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */
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
/**
 * @api {put} api/entries Update entry
 * @apiVersion 1.0.0
 * @apiName putEntry
 * @apiGroup Entries
 * @apiPermission onlyPatients
 *
 * @apiDescription Update existing entry for a specific date
 *
 * @apiParam {Date} Entry_date Entry date in yyyy-mm-dd format
 * @apiParam {String} Mood_color HEX value for color to describe mood: green (9BCF53), yellow (FFF67E), red (FF8585) or gray (D9D9D9)
 * @apiParam {List} Activities List of activities performed that day
 * @apiParam {Text} Notes Brief optional description of the day
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "entry_date": "2024-01-01",
 *      "mood_color": ""
 *      "activities": ['Meditation', 'Listening to music']
 *      "notes": "Started a baking class today!"
 *    }
 *
 * @apiSuccess {String} message Message for successful operation
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *        {
 *           "message": "Entry updated"
 *        }
 *
 *
 * @apiUse NoEntryToModifyError
 * @apiUse InvalidActivityError
 * @apiUse MissingActivitiesListError
 * @apiUse NoKubiosDataError
 * @apiUse InvalidEntrySyntax
 * @apiUse InvalidMoodColorError
 * @apiUse OnlyForPatientsError
 * @apiUse SurveyNotCompletedError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 * @apiUse dbError
 */
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
 * @api {get} api/entries/monthly?month=__&year=__ Get month with entries
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
 * @apiSuccess {Dictionary} Dates Key-value pairs for each date in the selected month, with entry data if available
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
 * @apiUse dbError
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

/**
 * @api {get} api/entries/daily/:entry_date Get specific entry
 * @apiVersion 1.0.0
 * @apiName getMonth
 * @apiGroup Entries
 * @apiPermission onlyPatients
 *
 * @apiDescription Get entry for a specific date
 *
 * @apiParam {Date} Entry_date Date in yyyy-mm-dd format
 *
 * @apiSuccess {Dictionary} Diary_entry contains all data for entry from DiaryEntries table
 * @apiSuccess {Dictionary} Measurement_data contains limited amount of data for entry from Measurements table
 * @apiSuccess {List} Activities List of activities associated with the entry
 *
 * @apiSuccessExample Success-Response containing entries:
 *    HTTP/1.1 200 OK
 *        {
 *          "diary_entry": {
 *                "entry_id": 1,
 *                "user_id": 2,
 *                "entry_date": "2024-02-14",
 *                "mood_color": "9BCF53",
 *                "notes": "Ok day"
 *          },
 *          "measurement_data": {
 *                "measurement_id": 1,
 *                "kubios_result_id": "f51asdf1a-d42d-234-8f3r-a78asdf4e",
 *                "measurement_date": "2024-02-14",
 *                "mean_hr_bpm": "71.09",
 *                "sns_index": "0.62",
 *                "pns_index": "-0.94",
 *                "stress_index": "10.67"
 *          },
 *          "activities": [
 *                "listItem1",
 *                "listItem2"
 *                ]
 *          }
 *
 * @apiUse InvalidEntrySyntax
 * @apiUse OnlyForPatientsError
 * @apiUse SurveyNotCompletedError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 * @apiUse dbError
 */
entryRouter
  .route('/daily/:entry_date')
  .get(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    param('entry_date', 'Date should be in yyyy-mm-dd format').isDate(),
    validationErrorHandler,
    getDay,
  );

/**
 * @api {get} api/entries/doctor/daily/:entry_date/:patient_id Get specific entry from patient
 * @apiVersion 1.0.0
 * @apiName getPatientDay
 * @apiGroup Entries
 * @apiPermission onlyDoctors
 *
 * @apiDescription Get patients specific entry
 *
 * @apiParam {Date} entry_date Date in yyyy-mm-dd format
 * @apiParam {Int} Patient_id Patients user ID
 *
 * @apiSuccess {Dictionary} Diary_entry contains all data for entry from DiaryEntries table
 * @apiSuccess {Dictionary} Measurement_data contains all Measurements table data
 * @apiSuccess {List} Activities List of activities associated with the entry
 *
 * @apiSuccessExample Success-Response containing entries:
 *    HTTP/1.1 200 OK
 *        {
 *          "diary_entry": {
 *                "entry_id": 1,
 *                "user_id": 2,
 *                "entry_date": "2024-02-14",
 *                "mood_color": "9BCF53",
 *                "notes": "Ok day"
 *          },
 *          "measurement_data": {
 *                "measurement_id": 6,
 *                "kubios_result_id": "26e680b8-31d6-44e8-ae41-0ab2670eedc1",
 *                "measurement_date": "2024-04-12",
 *                "artefact_level": "GOOD",
 *                "lf_power": "104.45",
 *                "lf_power_nu": "82.35",
 *                "hf_power": "22.38",
 *                "hf_power_nu": "17.65",
 *                "tot_power": "144.13",
 *                "mean_hr_bpm": "61.91",
 *                "mean_rr_ms": "969.20",
 *                "rmssd_ms": "7.95",
 *                "sd1_ms": "5.64",
 *                "sd2_ms": "14.49",
 *                "sdnn_ms": "10.97",
 *                "sns_index": "2.96",
 *                "pns_index": "-0.77",
 *                "stress_index": "29.61",
 *                "respiratory_rate": "14.91",
 *                "user_readiness": "48.45",
 *                "user_recovery": "48.45",
 *                "user_happiness": 2,
 *                "result_type": "readiness",
 *          },
 *          "activities": [
 *                "listItem1",
 *                "listItem2"
 *                ]
 *          }
 *
 * @apiUse ForbiddenDoctorRequest
 * @apiUse InvalidEntrySyntax
 * @apiUse PatientAccessingDoctorEndpointError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 * @apiUse dbError
 */
entryRouter
  .route('/doctor/daily/:entry_date/:patient_id')
  .get(
    authenticateToken,
    onlyForDoctorHandler,
    param('patient_id', 'Invalid patient ID').isInt(),
    param('entry_date', 'Entry date should be in yyyy-mm-dd format').isDate(),
    validationErrorHandler,
    verifyRightToViewPatientsData,
    getPatientDay,
  );

/**
 * @api {get} api/entries/doctor/monthly/:patient_id?month=__&year=__ Get patients month with entries
 * @apiVersion 1.0.0
 * @apiName getPatientMonth
 * @apiGroup Entries
 * @apiPermission onlyDoctors
 *
 * @apiDescription Retrieve patients monthly data, including more detailed HRV values.
 *
 * @apiParam {Int} Month Month number with leading zero if needed.
 * @apiParam {Int} Year Year between 2020-2030
 * @apiParam {Int} Patient_id User ID of the patient
 *
 * @apiSuccess {Dictionary} Dates Key-value pairs for each date in the selected month, with entry data if available
 *
 * @apiSuccessExample Success-Response containing entries:
 *    HTTP/1.1 200 OK
 *         {
 *             "2024-02-01": {},
 *             "2024-02-02": {},
 *             "2024-02-03": {},
 *              ...
 *             "2024-02-14": {
 *                    "user_id": 1,
 *                    "entry_id": 6,
 *                    "entry_date": "2024-02-14",
 *                    "mood_color": "FFF67E",
 *                    "notes": "Entry for week 7",
 *                    "measurement_id": 6,
 *                    "kubios_result_id": "26e680b8-31d6-44e8-ae41-0ab2670eedc1",
 *                    "measurement_date": "2024-04-12",
 *                    "artefact_level": "GOOD",
 *                    "lf_power": "104.45",
 *                    "lf_power_nu": "82.35",
 *                    "hf_power": "22.38",
 *                    "hf_power_nu": "17.65",
 *                    "tot_power": "144.13",
 *                    "mean_hr_bpm": "61.91",
 *                    "mean_rr_ms": "969.20",
 *                    "rmssd_ms": "7.95",
 *                    "sd1_ms": "5.64",
 *                    "sd2_ms": "14.49",
 *                    "sdnn_ms": "10.97",
 *                    "sns_index": "2.96",
 *                    "pns_index": "-0.77",
 *                    "stress_index": "29.61",
 *                    "respiratory_rate": "14.91",
 *                    "user_readiness": "48.45",
 *                    "user_recovery": "48.45",
 *                    "user_happiness": null,
 *                    "result_type": "readiness",
 *                    "all_activities": [
 *                               "Hiking",
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
 * @apiUse ForbiddenDoctorRequest
 * @apiUse InvalidUrlParameterForEntriesError
 * @apiUse YearNotInReachError
 * @apiUse PatientAccessingDoctorEndpointError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 * @apiUse dbError
 */
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

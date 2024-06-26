/* eslint-disable max-len */

import {authenticateToken} from '../middlewares/authentication.mjs';
import {param} from 'express-validator';
import express from 'express';
import {
  getAvailablePatientReports,
  getPatientsReport,
  getSpecificReport,
  getAvailableWeeks,
} from '../controllers/report-controller.mjs';
import {
  onlyForPatientWhoCompletedSurvey,
  verifyRightToViewPatientsData,
  validationErrorHandler,
  onlyForDoctorHandler,
} from '../middlewares/error-handler.mjs';

const reportRouter = express.Router();
/**
 * @apiDefine NoEntryDataForReportsError
 * @apiError NoEntryDataForReportsError No user data to calculate report
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": {
 *         "message": "No entries found with user_id=1",
 *         "status": 404
 *       }
 *     }
 */
/**
 * @apiDefine DoctorDoesntFindReportError
 * @apiError DoctorDoesntFindReportError Patient has no report with provided report ID
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": {
 *         "message": "There is no report_id=1 for patient_id=1",
 *         "status": 404
 *       }
 *     }
 */
/**
 * @apiDefine NoReportsAvailableError
 * @apiError NoReportsAvailableError Patient has no reports to find
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": {
 *         "message": "No reports found for patient_id=1",
 *         "status": 404
 *       }
 *     }
 */
/**
 * @apiDefine OnlyForDoctorsError
 * @apiError OnlyForDoctorsError Non-doctor user attempting to access restricted endpoint.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "message": "This endpoint is only for StressLess doctor users",
 *         "status": 403
 *       }
 *     }
 */

/**
 * @apiDefine ForbiddenDoctorRequest
 * @apiError ForbiddenDoctorRequest Doctor user attempting to access patient data without permission.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "message": "Requested patient is not sharing data with doctor_id=5",
 *         "status": 403
 *       }
 *     }
 */
/**
 * @apiDefine ReportNotFoundError
 * @apiError ReportNotFoundError Report could not be found with valid report ID
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": {
 *         "message": "Report_id=6 not found",
 *         "status": 404
 *       }
 *     }
 */
/**
 * @apiDefine InvalidReportIdError
 * @apiError InvalidReportIdError Invalid syntax for report ID in the URL
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Bad Request",
 *         "status": 400
 *         "errors": [
 *             {
 *                  "field":"report_id",
 *                  "message":"invalid value"
 *             }
 *         ]
 *       }
 *     }
 */
/**
 * @api {get} api/reports/available-weeks Get past week reports
 * @apiVersion 1.0.0
 * @apiName getAvailableWeeks
 * @apiGroup Reports
 * @apiPermission onlyPatients
 *
 * @apiDescription Fetch weeks that contain reports
 *
 * @apiSuccess {Int} user_id User ID that owns the report
 * @apiSuccess {Int} report_id Unique report ID for found report
 * @apiSuccess {Int} week_number Calendar week number
 * @apiSuccess {Date} week_start_date yyyy-mm-dd date when selected week started
 * @apiSuccess {Date} week_end_date yyyy-mm-dd date when selected week ended
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *          [
 *             {
 *                "user_id": 6,
 *                "report_id": 1,
 *                "week_number": 6,
 *                "week_start_date": "2024-02-05",
 *                "week_end_date": "2024-02-11"
 *              }
 *          ]
 *
 * @apiUse NoEntryDataForReportsError
 * @apiUse SurveyNotCompletedError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 * @apiUse dbError
 */
reportRouter
  .route('/available-weeks')
  .get(authenticateToken, onlyForPatientWhoCompletedSurvey, getAvailableWeeks);
/**
 * @api {get} api/reports/:report_id Get report
 * @apiVersion 1.0.0
 * @apiName getSpecificReport
 * @apiGroup Reports
 * @apiPermission onlyPatients
 *
 * @apiDescription Get a specific weekly report using report ID
 *
 * @apiParam {Int} report_id Unique report ID
 *
 * @apiSuccess {Int} report_id Unique report ID for found report
 * @apiSuccess {Int} week_number Calendar week number
 * @apiSuccess {Date} week_start_date yyyy-mm-dd date when selected week started
 * @apiSuccess {Date} week_end_date yyyy-mm-dd date when selected week ended
 * @apiSuccess {Float} red_percentage Red mood color percentage that week
 * @apiSuccess {Float} green_percentage Green mood color percentage that week
 * @apiSuccess {Float} yellow_percentage Yellow mood color percentage that week
 * @apiSuccess {Float} gray_percentage Gray mood color percentage that week
 * @apiSuccess {Float} monday_si Stress index for monday
 * @apiSuccess {Float} tuesday_si Stress index for tuesday
 * @apiSuccess {Float} wednesday_si Stress index for wednesday
 * @apiSuccess {Float} thursday_si Stress index for thursday
 * @apiSuccess {Float} friday_si Stress index for friday
 * @apiSuccess {Float} saturday_si Stress index for saturday
 * @apiSuccess {Float} sunday_si Stress index for sunday
 * @apiSuccess {Float} week_si_avg Stress index for the week
 * @apiSuccess {Float} previous_week_si_avg Stress index for the previous week
 * @apiSuccess {Date} created_at creation timestamp in yyyy-mm-dd format
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *          {
 *             "report_id": 1,
 *             "week_number": 6,
 *             "week_start_date": "2024-02-05",
 *             "week_end_date": "2024-02-11",
 *             "red_percentage": "14.29",
 *             "green_percentage": "14.29",
 *             "yellow_percentage": "14.29",
 *             "gray_percentage": "57.14",
 *             "monday_si": "0.00",
 *             "tuesday_si": "0.00",
 *             "wednesday_si": "0.00",
 *             "thursday_si": "0.00",
 *             "friday_si": "8.92",
 *             "saturday_si": "11.69",
 *             "sunday_si": "9.36",
 *             "week_si_avg": "4.28",
 *             "previous_week_si_avg": null,
 *             "created_at": "2024-04-28"
 *           }
 *
 * @apiUse InvalidReportIdError
 * @apiUse ReportNotFoundError
 * @apiUse SurveyNotCompletedError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 * @apiUse dbError
 */
reportRouter
  .route('/:report_id')
  .get(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    param('report_id').isInt(),
    validationErrorHandler,
    getSpecificReport,
  );
/**
 * @api {get} api/reports/doctor/available-weeks/:patient_id Get patients available week reports
 * @apiVersion 1.0.0
 * @apiName getAvailablePatientReports
 * @apiGroup Reports
 * @apiPermission onlyDoctors
 *
 * @apiDescription Retrieve generated reports from patients
 * 
 * @apiParam {Int} patient_id Patients user ID
 *
 * @apiSuccess {Int} user_id User ID that owns the report
 * @apiSuccess {Int} report_id Unique report ID for found report
 * @apiSuccess {Int} week_number Calendar week number
 * @apiSuccess {Date} week_start_date yyyy-mm-dd date when selected week started
 * @apiSuccess {Date} week_end_date yyyy-mm-dd date when selected week ended
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
*          [
 *             {
 *                "user_id": 6,
 *                "report_id": 1,
 *                "week_number": 6,
 *                "week_start_date": "2024-02-05",
 *                "week_end_date": "2024-02-11"
 *              }
 *          ]
 *
 * @apiUse NoReportsAvailableError
 * @apiUse ForbiddenDoctorRequest
 * @apiUse OnlyForDoctorsError
 * @apiUse InvalidReportIdError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 * @apiUse dbError
 */
reportRouter
  .route('/doctor/available-weeks/:patient_id')
  .get(
    authenticateToken,
    onlyForDoctorHandler,
    param('patient_id').isInt(),
    validationErrorHandler,
    verifyRightToViewPatientsData,
    getAvailablePatientReports,
  );
/**
 * @api {get} api/reports/doctor/specific-report/:report_id/:patient_id Get patients specific week report
 * @apiVersion 1.0.0
 * @apiName getPatientsReport
 * @apiGroup Reports
 * @apiPermission onlyDoctors
 *
 * @apiDescription Get patients specific week report using patient and report ID's
 *
 * @apiParam {Int} report_id Unique report ID
 * @apiParam {Int} patient_id Patients user ID
 *
 * @apiSuccess {Int} report_id Unique report ID for found report
 * @apiSuccess {Int} week_number Calendar week number
 * @apiSuccess {Date} week_start_date yyyy-mm-dd date when selected week started
 * @apiSuccess {Date} week_end_date yyyy-mm-dd date when selected week ended
 * @apiSuccess {Float} red_percentage Red mood color percentage that week
 * @apiSuccess {Float} green_percentage Green mood color percentage that week
 * @apiSuccess {Float} yellow_percentage Yellow mood color percentage that week
 * @apiSuccess {Float} gray_percentage Gray mood color percentage that week
 * @apiSuccess {Float} monday_si Stress index for monday
 * @apiSuccess {Float} tuesday_si Stress index for tuesday
 * @apiSuccess {Float} wednesday_si Stress index for wednesday
 * @apiSuccess {Float} thursday_si Stress index for thursday
 * @apiSuccess {Float} friday_si Stress index for friday
 * @apiSuccess {Float} saturday_si Stress index for saturday
 * @apiSuccess {Float} sunday_si Stress index for sunday
 * @apiSuccess {Float} week_si_avg Stress index for the week
 * @apiSuccess {Float} previous_week_si_avg Stress index for the previous week
 * @apiSuccess {Date} created_at creation timestamp in yyyy-mm-dd format
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *          {
 *             "report_id": 1,
 *             "week_number": 6,
 *             "week_start_date": "2024-02-05",
 *             "week_end_date": "2024-02-11",
 *             "red_percentage": "14.29",
 *             "green_percentage": "14.29",
 *             "yellow_percentage": "14.29",
 *             "gray_percentage": "57.14",
 *             "monday_si": "0.00",
 *             "tuesday_si": "0.00",
 *             "wednesday_si": "0.00",
 *             "thursday_si": "0.00",
 *             "friday_si": "8.92",
 *             "saturday_si": "11.69",
 *             "sunday_si": "9.36",
 *             "week_si_avg": "4.28",
 *             "previous_week_si_avg": null,
 *             "created_at": "2024-04-28"
 *           }
 *
 * @apiUse DoctorDoesntFindReportError
 * @apiUse ForbiddenDoctorRequest
 * @apiUse OnlyForDoctorsError
 * @apiUse InvalidReportIdError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 * @apiUse dbError
 */
reportRouter
  .route('/doctor/specific-report/:report_id/:patient_id')
  .get(
    authenticateToken,
    onlyForDoctorHandler,
    param('patient_id').isInt(),
    param('report_id').isInt(),
    validationErrorHandler,
    verifyRightToViewPatientsData,
    getPatientsReport,
  );

export default reportRouter;

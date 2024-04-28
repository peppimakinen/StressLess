import {authenticateToken} from '../middlewares/authentication.mjs';
import {param} from 'express-validator';
import express from 'express';
import {
  onlyForPatientWhoCompletedSurvey,
  onlyForPatientHandler,
  validateSurvey,
  onlyForDoctorHandler,
  verifyRightToViewPatientsData,
  validationErrorHandler,
} from '../middlewares/error-handler.mjs';
import {
  getOwnSurvey,
  postSurvey,
  getActivities,
  getPatientSurvey,
} from '../controllers/survey-controller.mjs';

const surveyRouter = express.Router();
/**
 * @apiDefine SurveyNotCompletedError
 * @apiError SurveyNotCompletedError Authenticated patient hasn't done survey
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": {
 *         "message": "No survey found with user_id=1",
 *         "status": 404
 *       }
 *     }
 */

/**
 * @apiDefine SurveyRequestEmpty
 * @apiError SurveyRequestEmpty Request body is missing questions and answers
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Empty survey cant be submitted",
 *         "status": 400
 *       }
 *     }
 */
/**
 * @apiDefine SurveyMissingQuestion
 * @apiError SurveyMissingQuestion Question key is empty
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Provide text for every question",
 *         "status": 400
 *       }
 *     }
 */
/**
 * @apiDefine SurveyMissingListError
 * @apiError SurveyMissingListError There is no list in request for activities
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Missing a list for activities",
 *         "status": 400
 *       }
 *     }
 */

/**
 * @apiDefine TooManyActivitiesListsError
 * @apiError TooManyActivitiesListsError Multiple activity lists in request
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "There should be only one list in the request",
 *         "status": 400
 *       }
 *     }
 */

/**
 * @apiDefine EmptyActivitiesListError
 * @apiError EmptyActivitiesListError Activities list is empty
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Empty activity list cant be submitted",
 *         "status": 400
 *       }
 *     }
 */
/**
 * @apiDefine ExistingSurveyError
 * @apiError ExistingSurveyError User has already completed the survey
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "User has already completed the survey",
 *         "status": 400
 *       }
 *     }
 */
/**
 * @apiDefine SurveyInvalidActivityError
 * @apiError SurveyMissingListError Activity list item lenght is too long
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Invalid activity:'aaaaaaaaaaaaaaaaaaaaaaaaa......'",
 *         "status": 400,
 *         "errors": "Character limit for each activity is 75"
 *       }
 *     }
 */
/**
 * @apiDefine InvalidSurveyAnswerError
 * @apiError InvalidSurveyAnswerError Answer text over 250 characters
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad request
 *     {
 *       "error": {
 *         "message": "The asnwer for 'How are you?' is too long",
 *         "status": 400,
 *         "errors": "Character limit for each activity is 250"
 *       }
 *     }
 */
/**
 * @apiDefine PatientAccessingDoctorEndpointError
 * @apiError PatientAccessingDoctorEndpointError Unauthorized patient user
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
 * @api {get} api/survey Get own survey
 * @apiVersion 1.0.0
 * @apiName getOwnSurvey
 * @apiGroup Survey
 * @apiPermission onlyPatients
 *
 * @apiDescription Get questions and activities after submitting survey
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *       {
 *          "questions": [
 *              {
 *                  "question": "Question 1 text",
 *                   "answer": "answer 1 text"
 *              },
 *              {
 *                   "question": "Question 2 text",
 *                   "answer": "answer 2 text"
 *              }
 *         ],
 *         "activities": [
 *               "Activity1",
 *               "Activity2",
 *               "Activity3"
 *         ]
 *       }
 *
 * @apiUse SurveyNotCompletedError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */
surveyRouter
  .route('/')
  .get(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    getOwnSurvey,
  )
/**
 * @api {post} api/survey Post new survey
 * @apiVersion 1.0.0
 * @apiName postSurvey
 * @apiGroup Survey
 * @apiPermission onlyPatients
 *
 * @apiDescription Submit new survey for a patient user
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *       {
 *          "message": "Survey posted successfully!"
 *       }
 *
 * @apiUse SurveyRequestEmpty
 * @apiUse SurveyMissingListError
 * @apiUse SurveyMissingQuestion
 * @apiUse TooManyActivitiesListsError
 * @apiUse SurveyInvalidActivityError
 * @apiUse InvalidSurveyAnswerError
 * @apiUse EmptyActivitiesListError
 * @apiUse ExistingSurveyError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */
  .post(
    authenticateToken,
    onlyForPatientHandler,
    validateSurvey,
    postSurvey,
  );

/**
 * @api {get} api/survey/activities Get activities
 * @apiVersion 1.0.0
 * @apiName getActivities
 * @apiGroup Survey
 * @apiPermission onlyPatients
 *
 * @apiDescription Get activities after submitting survey
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *       {
 *         "activities": [
 *               "Activity1",
 *               "Activity2",
 *               "Activity3"
 *         ]
 *       }
 *
 * @apiUse SurveyNotCompletedError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */
surveyRouter
  .route('/activities')
  .get(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    getActivities,
  );

/**
 * @api {get} api/survey/doctor/:ID Get patients survey
 * @apiVersion 1.0.0
 * @apiName getPatientSurvey
 * @apiGroup Survey
 * @apiPermission onlyDoctor
 *
 * @apiDescription Get own patients survey
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *       {
 *          "questions": [
 *              {
 *                  "question": "Question 1 text",
 *                   "answer": "answer 1 text"
 *              },
 *              {
 *                   "question": "Question 2 text",
 *                   "answer": "answer 2 text"
 *              }
 *         ],
 *         "activities": [
 *               "Activity1",
 *               "Activity2",
 *               "Activity3"
 *         ]
 *       }
 *
 * @apiUse PatientAccessingDoctorEndpointError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */
surveyRouter
  .route('/doctor/:patient_id')
  .get(
    authenticateToken,
    onlyForDoctorHandler,
    param('patient_id', 'Invalid patient ID').isInt(),
    validationErrorHandler,
    verifyRightToViewPatientsData,
    getPatientSurvey,
  );
export default surveyRouter;

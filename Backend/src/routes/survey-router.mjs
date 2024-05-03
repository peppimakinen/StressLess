import {authenticateToken} from '../middlewares/authentication.mjs';
import {param} from 'express-validator';
import express from 'express';
import {
  onlyForPatientWhoCompletedSurvey,
  verifyRightToViewPatientsData,
  validationErrorHandler,
  onlyForPatientHandler,
  onlyForDoctorHandler,
  validateSurvey,
} from '../middlewares/error-handler.mjs';
import {
  getPatientSurvey,
  getActivities,
  getOwnSurvey,
  postSurvey,
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
 * @apiDefine MissingActivitiesListError
 * @apiError MissingActivitiesListError There is no list in request for activities
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
 * @apiDefine InvalidActivityError
 * @apiError InvalidActivityError Activity list item lenght is too long
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
 * @apiSuccess {List} questions List of questions and answers
 * @apiSuccess {String} question Question text from survey
 * @apiSuccess {String} answer Answer to that specific question
 * @apiSuccess {List} activities List of defined activities to manage stress
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
 * @apiParam {Object} Request Request that contains 1 activities list and atleast one question and answer pair
 * @apiParam {String} Question Question defined in vaatimusdokumentti liite 3
 * @apiParam {String} Answer Patient users answer to that specific question
 * @apiParam {List} Activities List containing atleast 1 activity
 *
 * @apiParamExample {json} Request-Example:
 *       {
 *          "Do you feel stressed ofter": "No not really",
 *          ...
 *          "Do you want to expand on your current situation": "Yes, I feel ..",
 *          "What are activities that help you manage stress": ["Meditation", "Hiking"]
 *       }
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *       {
 *          "message": "Survey posted successfully!"
 *       }
 *
 * @apiUse SurveyRequestEmpty
 * @apiUse MissingActivitiesListError
 * @apiUse SurveyMissingQuestion
 * @apiUse TooManyActivitiesListsError
 * @apiUse InvalidActivityError
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
 * @apiSuccess {List} activities List of defined activities to manage stress
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
 * @api {get} api/survey/doctor/:patient_id Get patients survey
 * @apiVersion 1.0.0
 * @apiName getPatientSurvey
 * @apiGroup Survey
 * @apiPermission onlyDoctors
 *
 * @apiDescription Get own patients survey
 *
 * @apiParam {Int} Patient_id Patients user ID
 *
 * @apiSuccess {List} questions List of questions and answers
 * @apiSuccess {String} question Question text from survey
 * @apiSuccess {String} answer Answer to that specific question
 * @apiSuccess {List} activities List of defined activities to manage stress
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
 * @apiUse ForbiddenDoctorRequest
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

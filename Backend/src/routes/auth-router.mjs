import {doctorPostLogin} from '../controllers/doctor-auth-controller.mjs';
import {validationErrorHandler} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body} from 'express-validator';
import express from 'express';
import {
  patientPostLogin,
  getMe,
} from '../controllers/patient-auth-controller.mjs';

const authRouter = express.Router();

/**
 * @apiDefine all No authentication needed.
 */

/**
 * @apiDefine onlyPatients Only signed in users with patient token.
 */

/**
 * @apiDefine onlyDoctors Only signed in users with doctor token.
 */

/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */

/**
 * @apiDefine UnauthorizedPatientError
 * @apiError UnauthorizedPatientError Invalid patient username or password.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": {
 *         "message": "Incorrect username or password for StressLess or Kubios",
 *         "status": 401
 *       }
 *     }
 */

/**
 * @apiDefine InvalidTokenError
 * @apiError InvalidTokenError Expired or invalid token
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": {
 *         "message": "Invalid bearer token",
 *         "status": 401
 *       }
 *     }
 */

/**
 * @apiDefine TokenMissingError
 * @apiError TokenMissingError Token missing
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "message": "Bearer token missing",
 *         "status": 403
 *       }
 *     }
 */
/**
 * @apiDefine UnauthorizedDoctorError
 * @apiError UnauthorizedDoctorError Invalid doctor username or password.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": {
 *         "message": "Incorrect username or password",
 *         "status": 401,
 *         "errors": "Contact StressLess Admins for access inquiries"
 *       }
 *     }
 */

/**
 * @apiDefine LoginValidationError
 * @apiError LoginValidationError Invalid request body
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Bad Request",
 *         "status": 400,
 *         "errors": [
 *              {
 *                 "field": "password",
 *                 "message":"Invalid value"
 *              }
 *          ]
 *       }
 *     }
 */

/**
 * @api {post} api/auth/patient-login Login for patient user
 * @apiVersion 1.0.0
 * @apiName PatientPostLogin
 * @apiGroup Authentication
 * @apiPermission all
 *
 * @apiDescription Authenticate using Kubios credentials to obtain a token
 *
 * @apiParam {String} Username Kubios username
 * @apiParam {String} Password Kubios password
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "username": "johnd@email.com",
 *      "password": "secret"
 *    }
 *
 * @apiSuccess {String} message Message for successful login
 * @apiSuccess {Object} user User info.
 * @apiSuccess {Int} user_id Unique user ID
 * @apiSuccess {String} username Email address that acts as a username
 * @apiSuccess {String} full_name First and last name from Kubios Cloud
 * @apiSuccess {String} user_level Indicate that user is patient
 * @apiSuccess {String} created_at User creation timestamp (ISO 8601 format)
 * @apiSuccess {Boolean} Flag indicating survey completion status
 * @apiSuccess {String} token Token for the user authentication

 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Logged in successfully with StressLess and Kubios",
 *      "user": {
 *        "user_id": 21,
 *        "username": "johnd",
 *        "full_name": "John Doe"
 *        "user_level": "patient",
 *        "created_at": "2024-04-24T15:51:01.000Z",
 *        "surveyCompleted": false
 *      }
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMSwid
 *                XNlcm5hbWUiOiJ1dXNpMSIsImVtYWlsIjoidXVzaTFAZXhhbXBsZS5jb20
 *                iLCJ1c2VyX2xldmVsX2lkIjoyLCJpYXQiOjE3MDEyNzkzMjJ9.3TbVTcXS
 *                dryTDm_huuXC_U1Lg4rL0SOFyn_WAsC6W0Y"
 *    }
 *
 * @apiUse UnauthorizedPatientError
 * @apiUse LoginValidationError
 */
authRouter
  .post(
    '/patient-login',
    body('username').trim().isEmail(),
    body('password').trim().isLength({min: 3, max: 128}),
    validationErrorHandler,
    patientPostLogin,
  );

/**
 * @api {post} api/auth/doctor-login Login for doctor user
 * @apiVersion 1.0.0
 * @apiName doctorPostLogin
 * @apiGroup Authentication
 * @apiPermission all
 *
 * @apiDescription Authenticate using StressLess credentials to obtain a token
 *
 * @apiParam {String} Username StressLess username
 * @apiParam {String} Password StressLess password
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "username": "doctorUser@email.com",
 *      "password": "secret2"
 *    }
 *
 * @apiSuccess {String} message Message for successful login
 * @apiSuccess {Object} user User info.
 * @apiSuccess {Int} user_id Unique user ID
 * @apiSuccess {String} username Email address that acts as a username
 * @apiSuccess {String} full_name First and last name
 * @apiSuccess {String} user_level Indicate that user is doctor
 * @apiSuccess {String} created_at User creation timestamp (ISO 8601 format)
 * @apiSuccess {Boolean} Flag indicating survey completion status
 * @apiSuccess {String} token Token for the user authentication
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Logged in successfully with StressLess and Kubios",
 *      "user": {
 *        "user_id": 3,
 *        "username": "doctorUser@email.com",
 *        "full_name": "Andy Mcdoctor"
 *        "user_level": "doctor",
 *        "created_at": "2024-04-24T15:51:01.000Z"
 *      }
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMSwid
 *                XNlcm5hbWUiOiJ1dXNpMSIsImVtYWlsIjoidXVzaTFAZXhhbXBsZS5jb20
 *                iLCJ1c2VyX2xldmVsX2lkIjoyLCJpYXQiOjE3MDEyNzkzMjJ9.3TbVTcXS
 *                dryTDm_huuXC_U1Lg4rL0SOFyn_WAsC6W0Y"
 *    }
 *
 * @apiUse UnauthorizedDoctorError
 * @apiUse LoginValidationError
 */
authRouter
  .post(
    '/doctor-login',
    body('username').trim().isEmail(),
    body('password').trim().isLength({min: 3, max: 128}),
    validationErrorHandler,
    doctorPostLogin,
  );

/**
 * @api {get} api/auth/me Get self
 * @apiVersion 1.0.0
 * @apiName getMe
 * @apiGroup Authentication
 * @apiPermission token
 *
 * @apiDescription Get self using authentication token
 *
 * @apiSuccess {Object} stressLessUser StressLess user
 * @apiSuccess {Int} user_id Unique user ID
 * @apiSuccess {String} username Email address that acts as a username
 * @apiSuccess {String} full_name First and last name from Kubios Cloud
 * @apiSuccess {String} user_level Indicate if user is Doctor or Patient
 * @apiSuccess {String} created_at User creation timestamp (ISO 8601 format)
 * @apiSuccess {Boolean} Flag indicating survey completion status
 * @apiSuccess {Int} iat Token Initialization time
 * @apiSuccess {Int} exp Token expiration time
 * @apiSuccess {Int} entry_count Number of diary entries
 * @apiSuccess {List} chosen_doctor List containing chosen doctor information
 * @apiSuccess {Object} kubiosUser User data from Kubios Cloud
 *
 * @apiSuccessExample Success-Response for patient user:
 *    HTTP/1.1 200 OK
 *     {
 *        "stressLessUser": {
 *            "user_id": 5,
 *            "username": "johnd@email.com",
 *            "full_name": "John Doe",
 *            "user_level": "patient",
 *            "created_at": "2024-04-24T15:51:01.000Z",
 *            "surveyCompleted": false,
 *            "iat": 1714217147,
 *            "exp": 1714220747,
 *            "entry_count": 1,
 *            "chosen_doctor": [
 *                {
 *                    "user_id": 3,
 *                    "username": "doctorUser@email.com",
 *                    "full_name": "Andy Mcdoctor",
 *                    "user_level": "doctor",
 *                    "created_at": "2024-04-24T12:04:20.000Z"
 *                }
 *            ]
 *        },
 *        "kubiosUser": {
 *            "email": "johnd@email.com",
 *            "family_name": "Doe",
 *            "given_name": "John",
 *            "sub": "edasdfasdf9-ddsfa0-83d1-7askkhg17d4"
 *        }
 *    }
 *
 * @apiSuccessExample Success-Response for doctor user:
 *    HTTP/1.1 200 OK
 *    {
 *       "user_id": 3,
 *       "username": "doctorUser@email.com",
 *       "full_name": "Andy Mcdoctor",
 *       "user_level": "doctor",
 *       "created_at": "2024-04-24T12:04:20.000Z",
 *       "iat": 1714216973,
 *       "exp": 1714220573
 *     }
 *
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */
authRouter.get('/me', authenticateToken, getMe);

export default authRouter;

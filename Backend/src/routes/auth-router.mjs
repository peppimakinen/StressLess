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
 * @apiParam {String} Kubios username.
 * @apiParam {String} Kubios password.
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "username": "johnd@email.com",
 *      "password": "secret"
 *    }
 * 
 * @apiSuccess {String} message Message for successful login
 * @apiSuccess {String} token Token for the user authentication.
 * @apiSuccess {Object} user User info.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Logged in successfully with StressLess and Kubios",
 *      "user": {
 *        "user_id": 21,
 *        "username": "johnd",
 *        "full_name: "John Doe"
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
 * @apiUser LoginValidationError
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
 * @apiParam {String} StressLess username
 * @apiParam {String} StressLess password
 *
 * @apiParamExample {json} Request-Example:
 *    {
 *      "username": "doctorUser@email.com",
 *      "password": "secret2"
 *    }
 *
 * @apiSuccess {String} message Message for successful login
 * @apiSuccess {String} token Token for the user authentication.
 * @apiSuccess {Object} user User info.
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "message": "Logged in successfully with StressLess and Kubios",
 *      "user": {
 *        "user_id": 3,
 *        "username": "doctorUser@email.com",
 *        "full_name: "Andy Mccoy"
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
 * @apiUser LoginValidationError
 */
authRouter
  .post(
    '/doctor-login',
    body('username').trim().isEmail(),
    body('password').trim().isLength({min: 3, max: 128}),
    validationErrorHandler,
    doctorPostLogin,
  );

authRouter.get('/me', authenticateToken, getMe);

export default authRouter;

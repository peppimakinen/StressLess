import {authenticateToken} from '../middlewares/authentication.mjs';
import {body, param} from 'express-validator';
import express from 'express';
import {
  validationErrorHandler,
  onlyForPatientHandler,
  onlyForDoctorHandler,
} from '../middlewares/error-handler.mjs';
import {
  changeDoctorPassword,
  getPatients,
  postDoctor,
  deleteSelf,
  getDoctor,
  formPair,
} from '../controllers/user-controller.mjs';

const userRouter = express.Router();

/**
 * @apiDefine MissingNewPasswordError
 * @apiError MissingNewPasswordError New password missing in from PUT request.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Bad Request",
 *         "status": 400
 *         "errors": [
 *              {
 *                  "field":"new_password",
 *                  "message":"Invalid value"
 *              }
 *         ]
 *       }
 *     }
 */
/**
 * @apiDefine InvalidSearchError
 * @apiError InvalidSearchError Username from URL is not a email
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": {
 *         "message": "Bad Request",
 *         "status": 400
 *         "errors": [
 *              {
 *                  "field":"doctor_username",
 *                  "message":"Invalid username for doctor"
 *              }
 *         ]
 *       }
 *     }
 */
/**
 * @apiDefine IncorretConfirmationPasswordError
 * @apiError IncorretConfirmationPasswordError Incorrect password
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "message": "Invalid confirmation password",
 *         "status": 403
 *       }
 *     }
 */
/**
 * @apiDefine UserNotAdminError
 * @apiError UserNotAdminError Request doesnt contain ENV file password
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": {
 *         "message": "You are not a StressLess application admin",
 *         "status": 401
 *       }
 *     }
 */
/**
 * @apiDefine DoctorNotFoundError
 * @apiError DoctorNotFoundError No doctor user found matching URL parameter
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": {
 *         "message": "No doctor was found using the provided username",
 *         "status": 404
 *       }
 *     }
 */
/**
 * @apiDefine NoPatientsError
 * @apiError NoPatientsError No patient has shared data with doctor user
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": {
 *         "message": "There is no patients sharing data with this doctor user",
 *         "status": 404
 *       }
 *     }
 */
/**
 * @apiDefine DuplicateDoctorError
 * @apiError DuplicateDoctorError Username taken when creating new doctor
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "error": {
 *         "message": "Username or email already taken",
 *         "status": 409
 *       }
 *     }
 */
/**
 * @api {delete} api/users Delete self
 * @apiVersion 1.0.0
 * @apiName deleteSelf
 * @apiGroup Users
 * @apiPermission token
 *
 * @apiDescription Delete all data from db linked to requesting user ID
 *
 * @apiSuccess {String} message Message for successful operation

 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *        {
 *            "message": "StressLess user deleted"
 *        }
 *
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */

userRouter
  .route('/')
  .delete(
    authenticateToken,
    deleteSelf,
  );

/**
 * @api {get} api/users/find-doctor/:doctor_username Find doctor
 * @apiVersion 1.0.0
 * @apiName getDoctor
 * @apiGroup Users
 * @apiPermission onlyPatients
 *
 * @apiDescription Search for a doctor information using their username
 *
 * @apiParam {String} doctor_username Username that is a email for doctor user
 *
 * @apiSuccess {Object} found_doctor Found doctor user information
 * @apiSuccess {Int} user_id Unique user ID
 * @apiSuccess {String} username Doctor username
 * @apiSuccess {String} user_level Doctor user level
 * @apiSuccess {Datetime} created_at User creation timestamp
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *        {
 *            "found_doctor": {
 *                  "user_id": 2,
 *                  "username": "newDoctor@email.com",
 *                  "full_name": "Marko Anttila",
 *                  "user_level": "doctor",
 *                  "created_at": "2024-04-29T15:33:34.000Z"
 *             }
 *         }
 *
 * @apiUse InvalidSearchError
 * @apiUse DoctorNotFoundError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */

userRouter
  .route('/find-doctor/:doctor_username')
  .get(
    authenticateToken,
    onlyForPatientHandler,
    param('doctor_username', 'Invalid username for doctor').isEmail().trim(),
    validationErrorHandler,
    getDoctor,
  );

/**
 * @api {post} api/users/create-pair Share data with doctor
 * @apiVersion 1.0.0
 * @apiName formPair
 * @apiGroup Users
 * @apiPermission onlyPatients
 *
 * @apiDescription Share data as patient to a specific doctor
 *
 * @apiParam {String} doctor_username Username that is a email for doctor user
 *
 * @apiSuccess {String} message Message for successful operation

 * @apiSuccessExample Success-Response:
 *       HTTP/1.1 200 OK
 *           {
 *                "message": "user@email.com is now sharing their data with Marko Anttila the doctor"
 *            }
 *
 * @apiUse InvalidSearchError
 * @apiUse DoctorNotFoundError
 * @apiUse OnlyForPatientsError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */
userRouter
  .route('/create-pair')
  .post(
    authenticateToken,
    onlyForPatientHandler,
    body('doctor_username', 'Doctor username should be their email').isEmail(),
    validationErrorHandler,
    formPair,
  );

/**
 * @api {get} api/users/doctor/patients Get own patients
 * @apiVersion 1.0.0
 * @apiName getPatients
 * @apiGroup Users
 * @apiPermission onlyDoctors
 *
 * @apiDescription Get a list of patients that share data with doctor user
 *
 * @apiSuccess {List} List patients sharing data
 * @apiSuccess {Int} username Patients username
 * @apiSuccess {String} Patients full name
 * @apiSuccess {String} Patients user level
 * @apiSuccess {Datetime} Patients created at timestamp
 * @apiSuccess {Int} The pair ID with this patient
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *        [
 *            {
 *                "user_id": 1,
 *                "username": "aleksi.kivilehto@metropolia.fi",
 *                "full_name": "Aleksi Kivilehto",
 *                "user_level": "patient",
 *                "created_at": "2024-04-28T17:33:54.000Z",
 *                "pair_id": 3
 *            }
 *         ]
 *
 * @apiUse OnlyForDoctorsError
 * @apiUse NoPatientsError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */

userRouter
  .route('/doctor/patients')
  .get(
    authenticateToken,
    onlyForDoctorHandler,
    getPatients,
  );

/**
 * @api {put} api/users/doctor/change-password Change password
 * @apiVersion 1.0.0
 * @apiName changeDoctorPassword
 * @apiGroup Users
 * @apiPermission onlyDoctors
 *
 * @apiDescription Change password for a doctor user
 *
 * @apiSuccess {List} List patients sharing data
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *        {
 *            "message": "Password updated"
 *        }
 *
 * @apiUse MissingNewPasswordError
 * @apiUse OnlyForDoctorsError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */
userRouter
  .route('/doctor/change-password')
  .put(
    authenticateToken,
    onlyForDoctorHandler,
    body('new_password').isLength({min: 3, max: 128}),
    validationErrorHandler,
    changeDoctorPassword,
  );

/**
 * @api {post} api/users/create-doctor Create doctor user
 * @apiVersion 1.0.0
 * @apiName postDoctor
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiDescription Create new doctor user using admin password
 *
 * @apiParam {String} Username Email address to use as a username
 * @apiParam {String} Password Temporary password for the new user
 * @apiParam {String} Full_name Full name of the doctor
 * @apiParam {String} User_level provide 'doctor'
 * @apiParam {String} Admin_password Password defined in ENV for admins
 *
 * @apiParamExample {json} Request-Example:
 *          {
 *             "username": "newDoctor@email.com",
 *             "password": "secret"
 *             "full_name":"Marko Anttila",
 *             "user_level":"doctor",
 *             "admin_password":"checkEnvFile"
 *           }
 *
 * @apiSuccess {String} message Message for successful request
 * @apiSuccess {Int} user_id New doctor user ID
 *
 * @apiSuccessExample Success-Response:
 *    HTTP/1.1 200 OK
 *          {
 *             "message": "new user created",
 *             "user_id": 5
 *           }
 *
 * @apiUse DuplicateDoctorError
 * @apiUse UserNotAdminError
 */
userRouter
  .route('/create-doctor')
  .post(body('username', 'Invalid email address').trim().isEmail(), postDoctor);

export default userRouter;

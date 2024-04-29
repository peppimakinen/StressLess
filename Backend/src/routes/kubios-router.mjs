import {authenticateToken} from '../middlewares/authentication.mjs';
import {param} from 'express-validator';
import express from 'express';
import {
  checkDate,
} from '../controllers/kubios-controller.mjs';
import {
  validationErrorHandler,
  onlyForPatientHandler,
} from '../middlewares/error-handler.mjs';

const kubiosRouter = express.Router();

/**
 * @apiDefine OnlyForPatientsError
 * @apiError OnlyForPatientsError Non-patient accessing unauthorized endpoint
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "message": "This endpoint is only for StressLess patient users",
 *         "status": 403
 *       }
 *     }
 */

/**
 * @apiDefine InvalidUrlParameterError
 * @apiError InvalidUrlParameterError URL date parameter didnt pass validation
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "message": "Bad Request",
 *         "status": 400
 *         "errors": [
 *            {
 *                "field":"date",
 *                "message":"Date should be in yyyy-mm-dd format"
 *            }
 * ]
 *       }
 *     }
 */

/**
 * @api {get} api/kubios/check/:date Check date for kubios data
 * @apiVersion 1.0.0
 * @apiName checkDate
 * @apiGroup Kubios
 * @apiPermission onlyPatients
 *
 * @apiDescription Check if specific date contains kubios data
 *
 * @apiParam {Date} Date Date in yyyy-mm-dd format
 *
 * @apiSuccess {Boolean} kubiosDataFound Boolean for HRV data presence
 *
 * @apiSuccessExample Success-Response when data found:
 *    HTTP/1.1 200 OK
 *       {
 *          "kubiosDataFound": true
 *       }
 * @apiSuccessExample Success-Response when data not found:
 *    HTTP/1.1 200 OK
 *       {
 *          "kubiosDataFound": false
 *       }
 *
 * @apiUse OnlyForPatientsError
 * @apiUse InvalidUrlParameterError
 * @apiUse InvalidTokenError
 * @apiUse TokenMissingError
 */
kubiosRouter
  .get('/check/:date',
    param('date', 'Date should be in yyyy-mm-dd format').isDate(),
    validationErrorHandler,
    authenticateToken,
    onlyForPatientHandler,
    checkDate,
  );

export default kubiosRouter;

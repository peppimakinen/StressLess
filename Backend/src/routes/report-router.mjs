import {
  validationErrorHandler,
  onlyForPatientWhoCompletedSurvey,
  verifyRightToViewPatientsData,
  onlyForDoctorHandler,
} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {param} from 'express-validator';
import {
  getAvailableWeeks,
  getSpecificReport,
  getAvailablePatientReports,
  getPatientsReport,
} from '../controllers/report-controller.mjs';
import express from 'express';

// eslint-disable-next-line new-cap
const reportRouter = express.Router();
reportRouter
  .route('/available-weeks')
  .get(authenticateToken, onlyForPatientWhoCompletedSurvey, getAvailableWeeks);

reportRouter
  .route('/:report_id')
  .get(
    authenticateToken,
    onlyForPatientWhoCompletedSurvey,
    param('report_id').isInt(),
    validationErrorHandler,
    getSpecificReport,
  );

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

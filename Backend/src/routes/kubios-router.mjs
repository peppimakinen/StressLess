import express from 'express';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {
  getAllUserData,
  getSpecificData,
} from '../controllers/kubios-controller.mjs';
import {param} from 'express-validator';
import {
  validationErrorHandler,
  onlyForPatientHandler,
} from '../middlewares/error-handler.mjs';

// eslint-disable-next-line new-cap
const kubiosRouter = express.Router();

kubiosRouter
  .get('/user-data', authenticateToken, onlyForPatientHandler, getAllUserData)
  .get(
    '/data-for/:date',
    param('date', 'Date should be in yyyy-mm-dd format').isDate(),
    validationErrorHandler,
    authenticateToken,
    onlyForPatientHandler,
    getSpecificData,
  );

export default kubiosRouter;

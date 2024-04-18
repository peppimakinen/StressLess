import express from 'express';
import {param} from 'express-validator';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {
  checkDate,
} from '../controllers/kubios-controller.mjs';
import {
  validationErrorHandler,
  onlyForPatientHandler,
} from '../middlewares/error-handler.mjs';

// eslint-disable-next-line new-cap
const kubiosRouter = express.Router();

kubiosRouter
  .get('/check/:date',
    param('date', 'Date should be in yyyy-mm-dd format').isDate(),
    validationErrorHandler,
    authenticateToken,
    onlyForPatientHandler,
    checkDate,
  );

export default kubiosRouter;

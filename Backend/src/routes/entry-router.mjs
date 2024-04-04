import {validationErrorHandler} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body, param} from 'express-validator';
import express from 'express';
import {
  postEntry,
  getEntries,
  getEntryById,
  putEntry,
  deleteEntry,
} from '../controllers/entry-controller.mjs';

// eslint-disable-next-line new-cap
const entryRouter = express.Router();

entryRouter.route('/').get(authenticateToken, getEntries);

entryRouter.route('/').post(authenticateToken,
    body('entry_date', 'Date should be in yyyy-mm-dd format').isDate(),
    body('mood_color').isString(),
    body('notes').isString(),
    validationErrorHandler,
    postEntry);

entryRouter.route('/').put(authenticateToken,
    body('entry_id').isInt(),
    body('entry_date', 'Date should be in yyyy-mm-dd format').isDate(),
    body('mood_color').isString(),
    body('notes').isString(),
    validationErrorHandler,
    putEntry);

entryRouter.route('/').delete(authenticateToken,
    body('entry_id').isInt(),
    validationErrorHandler,
    deleteEntry);

entryRouter
    .route('/:id')
    .get(
        authenticateToken,
        param('id', 'must be integer').isInt(),
        validationErrorHandler,
        getEntryById,
    );

export default entryRouter;

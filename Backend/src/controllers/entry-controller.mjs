/* eslint-disable camelcase */
import {
  addEntry,
  listAllEntries,
  selectEntryById,
  updateEntryById,
  deleteEntryByIdUser,
  deleteEntryByIdAdmin,
  listAllEntriesByUserId,
} from '../models/entry-models.mjs';
import {customError} from '../middlewares/error-handler.mjs';


// Get all entries
const getEntries = async (req, res, next) => {
  let result = '';
  // Check what token is included in the request
  if (req.user.user_level === 'admin') {
    // Request contained admin token
    console.log('Admin user accessing all entries');
    result = await listAllEntries();
  } else {
    // Request contained regular token
    console.log('Regular user accessing all available entries');
    result = await listAllEntriesByUserId(req.user.user_id);
  }
  // Check if result is error-free
  if (!result.error) {
    // Send response containing entries
    res.json(result);
  } else {
    // Forward to errorhandler, if result contains a error
    next(new Error(result.error));
  }
};

// Get specific entries - only for admin
const getEntryById = async (req, res, next) => {
  // Check if token is linked to a admin user
  if (req.user.user_level === 'admin') {
    const result = await selectEntryById(req.params.id);
    if (result.error) {
      // Forward to errorhandler if result contains a error
      next(customError('Entry not found', 404));
    } else {
      // Send response containing entires, if there are no errors
      return res.json(result);
    }
  } else {
    // Unauthorized user was trying to reach this function
    next(customError('Unauthorized', 401));
  }
};

// Hande POST request for new diary entry
const postEntry = async (req, res, next) => {
  // Insert a new entry in the model
  const result = await addEntry(req.user, req.body);
  if (result.error) {
    // Forward to errorhandler if result contains a error
    next(customError(result.message, result.error));
  } else {
    // Respond with OK-status, if there was no errors
    res
        .status(201)
        .json({message: 'Entry added', entry_id: result[0].insertId});
  }
};

// Update existing diary entry using entry_id from request
const putEntry = async (req, res, next) => {
  const userId = req.user.user_id;
  const result = await updateEntryById({userId, ...req.body});
  if (result.error) {
    // Forward to errorhandler if result contains a error
    return next(customError(result.message, result.error));
  } else {
    // Respond with OK-status, if there was no errors
    return res.status(201).json(result);
  }
};

// Delete entry
const deleteEntry = async (req, res, next) => {
  let result = '';
  // Check what token is included in the request
  if (req.user.user_level === 'admin') {
    // Request contained admin token
    console.log('admin-user accessing deleteEntry function');
    result = await deleteEntryByIdAdmin(req.body.entry_id);
  } else {
    // Request contained regular token
    console.log('regular-user accessing deleteEntry function');
    result = await deleteEntryByIdUser(req.user.user_id, req.body.entry_id);
  }
  if (result.error) {
    // Forward to errorhandler, if result contains a error
    next(customError(result.message, result.error));
  } else {
    // Respond with OK-status, if there was no errors
    return res.json(result);
  }
};


export {
  getEntries,
  getEntryById,
  putEntry,
  deleteEntry,
  postEntry,
};

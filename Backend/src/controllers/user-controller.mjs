import bcrypt from 'bcryptjs';
import 'dotenv/config';
import {customError} from '../middlewares/error-handler.mjs';
import {
  deleteUserById,
  insertDoctor,
  insertUser,
  listAllUsers,
  selectUserById,
  updateUserById,
  selectDoctorByEmail,
  selectDoctorByName,
} from '../models/user-model.mjs';
/* eslint-disable camelcase */

// Get a list of all users - For admin
const getUsers = async (req, res, next) => {
  // Check if token is linked to admin user
  if (req.user.user_level === 'admin') {
    const result = await listAllUsers();
    // Check for error in result
    if (result.error) {
      // Forward to errorhandler if result contains a error
      next(customError(result.message, result.error));
    } else {
      // Send response containing users, if there are no errors
      return res.json(result);
    }
  } else {
    // Unauthorized user was trying to reach this function
    next(customError('Unauthorized', 401));
  }
};

// Get specific user using request parameters
const getUserById = async (req, res, next) => {
  const userLevel = req.user.user_level;
  const paramId = req.params.id;
  const userId = req.user.user_id;
  console.log('meneeeeee', userId, paramId);
  let result;
  // Check if token is linked to admin user
  if (userLevel === 'admin') {
    result = await selectUserById(paramId);
    if (result.error) {
      // Forward to errorhandler if result contains a error
      next(customError(result.message, result.error));
    } else {
      // Send response containing user, if there are no errors
      return res.json(result);
    }
    // Check for error in resul
  } else if (userLevel === 'regular' && paramId == userId) {
    console.log('Userid matches param and');
    result = await selectUserById(userId);
    if (result.error) {
      // Forward to errorhandler if result contains a error
      next(customError(result.message, result.error));
    } else {
      // Send response containing user, if there are no errors
      return res.json(result);
    }
  } else {
    // Unauthorized user was trying to reach this function
    next(customError('Unauthorized', 401));
  }
};

// Create a new user
const postUser = async (req, res, next) => {
  const {username, password, email} = req.body;
  // Generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // Apply salt and hash
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await insertUser({
    username,
    email,
    password: hashedPassword,
  });
  // Check for error in result
  if (result.error) {
    // Forward to errorhandler if result contains a error
    next(customError(result.message, result.error));
  } else {
    // Respond with a ok status - User created successfully
    return res.status(201).json(result);
  }
};

const postDoctor = async (req, res, next) => {
  const {username, password, full_name, admin_password} = req.body;
  if (admin_password !== process.env.APPLICATION_ADMIN_PASSWORD) {
    next(customError('You are not a StressLess application admin', 401));
    return;
  }
  // Generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // Apply salt and hash
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await insertDoctor(
    username,
    hashedPassword,
    full_name,
    'doctor',
  );
  // Check for error in result
  if (result.error) {
    // Forward to error handler if result contains an error
    next(customError(result.message, result.error));
  } else {
    // Respond with an OK status - User created successfully
    return res.status(201).json(result);
  }
};

// Update existing user
const putUser = async (req, res, next) => {
  const user_id = req.user.user_id;
  const {username, password, email} = req.body;
  // Generate salt to hash new password
  const salt = await bcrypt.genSalt(10);
  // Apply salt and hash
  const hashedPassword = await bcrypt.hash(password, salt);
  const result = await updateUserById({
    user_id,
    username,
    password: hashedPassword,
    email,
  });
  // Check for error in result
  if (result.error) {
    next(customError(result.message, result.error));
  } else {
    // Respond with a ok status - User update successful
    return res.status(201).json(result);
  }
};

// Delete user using request params
const deleteUser = async (req, res, next) => {
  // Check if token is linked to admin user
  if (req.user.user_level === 'admin') {
    const result = await deleteUserById(req.params.id);
    // Check for error in db
    if (result.error) {
      next(customError(result.message, result.error));
    } else {
      // Respond with a ok status - User deleted successfully
      return res.json(result);
    }
  } else {
    // Unauthorized user was trying to reach this function
    next(customError('Unauthorized', 401));
  }
};

const getDoctor = async (req, res, next) => {
  console.log('Patient user trying to find a doctor via usename or name');
  const nameOrEmail = req.body.doctor_name_or_email;
  // Check if there is a doctor with the same email/username address
  const doctorFoundWithEmail = await selectDoctorByEmail(nameOrEmail);
  // selectDoctorByEmail returns 404 error if doctor not found
  if (!doctorFoundWithEmail.error) {
    // There was no errors, so a matching doctor was found
    console.log('Found doctor using their username', doctorFoundWithEmail);
    // Attach a message
    doctorFoundWithEmail['message'] = 'Doctor found using email address';
    // Return selected doctor user data
    return res.json({found_doctor: doctorFoundWithEmail});
  }
  // Doctor was not found using email, try searching with full name
  console.log('No results with email adress, searching again with name...');
  const doctorFoundWithName = await selectDoctorByName(nameOrEmail);
  // selectDoctorByName returns 404 error if doctor not found
  if (!doctorFoundWithName.error) {
    // There was no errors, so a matching doctor was found
    console.log('Found doctor with full name');
    // Attach a message
    doctorFoundWithName['message'] = 'Doctor found using full name';
    // Return selected doctor user data
    return res.json({found_doctor: doctorFoundWithName});
  // If there was a error, no doctor was found
  } else {
    // Return a error message to the client
    next(
      customError(
        `Could not find doctor using: '${nameOrEmail}' as search input`,
        400,
      ),
    );
  }
};

export {
  getUsers,
  getUserById,
  postUser,
  putUser,
  deleteUser,
  postDoctor,
  getDoctor,
};

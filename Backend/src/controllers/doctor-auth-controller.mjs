import {selectDoctorByEmail} from '../models/user-model.mjs';
import {customError} from '../middlewares/error-handler.mjs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

/**
 * Handle POST requests for doctor login
 * @async
 * @param {Request} req Request object containing username and password
 * @param {Response} res
 * @param {Function} next
 */
const doctorPostLogin = async (req, res, next) => {
  const {username, password} = req.body;
  // Initialize generic login failed error messages
  const message = 'Invalid username or password';
  const info = 'Contact StressLess Admins for access inquiries';
  // Fetch existing doctor user
  const existingUser = await selectDoctorByEmail(username);
  // Check for errors
  if (existingUser.error) {
    // Check if error is db error
    if (existingUser.error === 500) {
      return next(customError(existingUser.message, existingUser.error));
    // User was not found and db returned 404 error
    } else {
      // Respond with a generic login failed error
      return next(customError(message, 401, info));
    }
  }
  // User was found if no errors occurred
  console.log('Doctor user found');
  // compare password and hash
  const match = await bcrypt.compare(password, existingUser.password);
  // if match, login successful
  if (match) {
    // Delete passwrod from user object
    delete existingUser.password;
    // Sign user data to the token
    const token = jwt.sign({...existingUser}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    // Return ok response
    return res.json({
      message: 'Logged in successfully',
      user: existingUser,
      token,
    });
  // Match failed
  } else {
    // Respond with a generic login failed error
    return next(customError(message, 401, info));
  }
};

export {doctorPostLogin};

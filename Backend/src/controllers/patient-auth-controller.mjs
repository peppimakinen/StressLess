/**
 * Authentication resource controller using Kubios API for login
 * @module controllers/auth-controller
 * @author mattpe <mattpe@metropolia.fi>
 * @requires jsonwebtoken
 * @requires bcryptjs
 * @requires dotenv
 * @requires models/user-model
 * @requires middlewares/error-handler
 * @exports postLogin
 * @exports getMe
 */

import 'dotenv/config';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import bcrypt from 'bcryptjs';
import {v4} from 'uuid';
import {customError} from '../middlewares/error-handler.mjs';
import {
  insertUser,
  selectUserByEmail,
  checkSurveyExistance,
} from '../models/user-model.mjs';

// Kubios API base URL should be set in .env
const baseUrl = process.env.KUBIOS_API_URI;

/**
 * Creates a POST login request to Kubios API
 * @async
 * @param {string} username Username in Kubios
 * @param {string} password Password in Kubios
 * @return {string} idToken Kubios id token
 */
const kubiosLogin = async (username, password) => {
  const csrf = v4();
  const headers = new Headers();
  headers.append('Cookie', `XSRF-TOKEN=${csrf}`);
  headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
  const searchParams = new URLSearchParams();
  searchParams.set('username', username);
  searchParams.set('password', password);
  searchParams.set('client_id', process.env.KUBIOS_CLIENT_ID);
  searchParams.set('redirect_uri', process.env.KUBIOS_REDIRECT_URI);
  searchParams.set('response_type', 'token');
  searchParams.set('scope', 'openid');
  searchParams.set('_csrf', csrf);

  const options = {
    method: 'POST',
    headers: headers,
    redirect: 'manual',
    body: searchParams,
  };
  let response;
  try {
    response = await fetch(process.env.KUBIOS_LOGIN_URL, options);
  } catch (err) {
    console.error('Kubios login error', err);
    throw customError('Login with Kubios failed', 500);
  }
  const location = response.headers.raw().location[0];
  // console.log(location);
  // If login fails, location contains 'login?null'
  if (location.includes('login?null')) {
    throw customError(
      'Incorrect username or password for StressLess or Kubios',
      401,
    );
  }
  // If login success, Kubios response location header
  // contains id_token, access_token and expires_in
  const regex = /id_token=(.*)&access_token=(.*)&expires_in=(.*)/;
  const match = location.match(regex);
  const idToken = match[1];
  console.log('PK succesfully logged in to kubios');
  return idToken;
};

/**
 * Get user info from Kubios API
 * @async
 * @param {string} idToken Kubios id token
 * @return {object} user User info
 */
const kubiosUserInfo = async (idToken) => {
  // Establish headers
  const headers = new Headers();
  headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
  headers.append('Authorization', idToken);
  // Send request
  const response = await fetch(baseUrl + '/user/self', {
    method: 'GET',
    headers: headers,
  });
  const responseJson = await response.json();
  // Check response status
  if (responseJson.status === 'ok') {
    console.log('Kubios user info found');
    return responseJson.user;
  } else {
    throw customError('Kubios user info failed', 500);
  }
};

/**
 * Attempt login to a localuser
 * @async
 * @param {string} email username == email and is used to log in to kubios
 * @return {object} result existing localuser info
 */
const attemptLocalLogin = async (email) => {
  try {
    const result = await selectUserByEmail(email);
    return result;
  } catch (error) {
    console.log('Error in attemptLocalLogin', error);
    return error;
  }
};

/**
 * Create a newlocal user to the database
 * @async
 * @param {object} kubiosUser User info from Kubios API
 * @return {object} result success message from user model
 */
const createNewLocalAccount = async (kubiosUser) => {
  try {
    console.log('Creating a new localuser...');
    // Generate a mock password that blends in to the db
    const salt = await bcrypt.genSalt(10);
    const password = v4();
    const hashedPassword = await bcrypt.hash(password, salt);
    // Establish new user
    const newUser = {
      username: kubiosUser.email,
      user_level: 'patient',
      full_name: `${kubiosUser.given_name} ${kubiosUser.family_name}`,
      password: hashedPassword,
    };
    // Insert new user to db
    const result = await insertUser(newUser);
    console.log(
      'New localuser created in the database, with username:',
      newUser.username,
    );
    return result;
  } catch (error) {
    console.log('Error in createNewLocalAccount', error);
    return {error: error};
  }
};

/**
 * Sync Kubios user info with local db
 * @async
 * @param {object} kubiosUser User info from Kubios API
 * @return {object} user from db
 */
const syncWithLocalUser = async (kubiosUser) => {
  // Attempt login
  let user = await attemptLocalLogin(kubiosUser.email);
  // User exists in db if no error occurred in attempted login
  if (!user.error) {
    console.log(`Checking if user_id=${user.user_id} has completed the survey`);
    const surveyStatus = await checkSurveyExistance(user.user_id);
    // Check if user has compleated survey
    if (!surveyStatus.error) {
      // if there is no error, survey has been compleated
      console.log(user.username, 'has compleated the survey');
      user['surveyCompleted'] = true;
    } else {
      // If there was a error, survey has not been compleated
      console.log(user.username, 'has not compleated the survey');
      user['surveyCompleted'] = false;
    }
    // Return existing and logged in localuser
    return user;
  }
  try {
    console.log('No existing localuser found');
    // No user was found in db, Create a new localuser
    await createNewLocalAccount(kubiosUser);
    // Sign in to the new user
    user = await attemptLocalLogin(kubiosUser.email);
    console.log('Signed in with this new localuser');
    // add a key to state that this is a new user for the client
    user['surveyCompleted'] = false;
    // Return new and logged in localuser
    return user;
    // Handle errors that occurred during new localuser sync
  } catch (error) {
    console.log('Could not create and sync new localuser', error);
    return error;
  }
};

/**
 * User login
 * @async
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {object} user if username & password match
 */
const patientPostLogin = async (req, res, next) => {
  console.log('Patient user accessing login');
  try {
    // Try to login with Kubios and get Kubios id token
    const {username, password} = req.body;
    const kubiosIdToken = await kubiosLogin(username, password);
    // If login ok, user kubios id token to get user data from kubios api
    const kubiosUser = await kubiosUserInfo(kubiosIdToken);
    // Sync kubios user with local user
    const user = await syncWithLocalUser(kubiosUser);
    // Include kubiosIdToken in the auth token used in this app
    const token = jwt.sign(
      {...user, token: kubiosIdToken},
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );
    console.log('Local user passed all login steps: ', user);
    return res.json({
      message: 'Logged in successfully with StressLess and Kubios',
      user,
      token,
    });
  } catch (err) {
    console.error('Kubios login error', err);
    return next(err);
  }
};
/**
 * Get user info based on token
 * @async
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {object} local and kubios user info
 */
const getMe = async (req, res) => {
  console.log('Entered getMe function');
  // Determine the user_level of the requesting user
  if (req.user.user_level === 'patient') {
    console.log(
      'Accessing patient user data with the username:',
      req.user.username,
    );
    // Get kubios user information
    const kubiosUser = await kubiosUserInfo(req.user.token);
    // Format response
    const user = {
      stressLessUser: req.user,
      kubiosUser: kubiosUser,
    };
    // Send response
    res.json(user).status(200);
    // If user is a doctor
  } else if (req.user.user_level === 'doctor') {
    console.log(req.body);
    console.log(
      'Accessing doctor user data with the username:',
      req.user.username,
    );
    // Return user info - this mimics a loopback
    res.json(req.user).status(200);
  }
};

export {patientPostLogin, getMe};

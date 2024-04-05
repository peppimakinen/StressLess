import 'dotenv/config';
import fetch from 'node-fetch';
import {customError} from '../middlewares/error-handler.mjs';

// Kubios API base URL should be set in .env
const baseUrl = process.env.KUBIOS_API_URI;

/**
 * Get user data from Kubios API example1
 * TODO: Implement error handling
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 */
const getAllUserData = async (req, res, next) => {
  try {
    console.log(req.user.username, 'accessing all kubios result data...');
    const headers = new Headers();
    headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
    headers.append('Authorization', req.user.token);

    const response = await fetch(
      // TODO: set the from date in request parameters
      baseUrl + '/result/self?from=2022-01-01T00%3A00%3A00%2B00%3A00',
      {
        method: 'GET',
        headers: headers,
      },
    );
    const results = await response.json();
    return res.json(results);
  } catch (error) {
    console.log('ERRRORRORORRO', error);
    next(customError('Kubios data could not be retrieved at this time', 500));
  }
};

const getToday = async (req, res, next) => {
  const currentDate = getTodaysDate;
  console.log('User fetching for todays kubios data...', currentDate);
};

/**
 * Get current date
 * @return {string} Current date in yyyy-mm-dd format
 */
function getTodaysDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export {getAllUserData, getToday};

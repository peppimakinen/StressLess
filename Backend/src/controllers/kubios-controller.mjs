import 'dotenv/config';
import fetch from 'node-fetch';
import {customError} from '../middlewares/error-handler.mjs';

// Kubios API base URL
const baseUrl = process.env.KUBIOS_API_URI;

/**
 * Get all user data from kubios API - mostly for testing connection
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

/**
 * Retrieve Kubios data for a specific date
 * @async
 * @param {Request} req - Request object including Kubios id token
 * @param {date} desiredDate Date that should be retrieved
 * @return {Object} - Object containing Kubios data or error information
 */
const retrieveDataForDate = async (req, desiredDate) => {
  try {
    console.log('Fetching kubios data for', desiredDate);
    // Establish headers
    const headers = new Headers();
    headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
    headers.append('Authorization', req.user.token);

    // Constructing from and to timestamps for the specific date
    const fromDate = new Date(desiredDate);
    fromDate.setUTCHours(0, 0, 0, 0);
    const toDate = new Date(desiredDate);
    toDate.setUTCHours(23, 59, 59, 999);

    const formattedFromDate = fromDate.toISOString();
    const formattedToDate = toDate.toISOString();

    const response = await fetch(
      baseUrl +
        `/result/self?types=readiness&daily=yes&from=${formattedFromDate}&to=${formattedToDate}`,
      {
        method: 'GET',
        headers: headers,
      },
    );
    // Check for successful response status
    if (!response.ok) {
      // If response status is not ok, throw an error
      throw new Error(`Error: ${response.status}`);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    // Return the error object instead of throwing
    return {error};
  }
};


/**
 * Check if there is a existing measurement on a specific date
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 * @return {boolean} kubiosDataFound
 */
const checkDate = async (req, res, next) => {
  // Get data from Kubios API
  const desiredDate = req.params.date;
  const result = await retrieveDataForDate(req, desiredDate);
  // Check for error in result
  if (result.error) {
    next(customError('Kubios data could not be retrieved at this time', 500));
  } else {
    // console.log('Measurement found', result)
    // Check how many measurements were fetched from Kubios
    const resultsLength = Object.keys(result.results).length;
    if (resultsLength === 0) {
      return res.json({kubiosDataFound: false});
    } else {
      return res.json({kubiosDataFound: true});
    }
  }
};

export {getAllUserData, checkDate, retrieveDataForDate};

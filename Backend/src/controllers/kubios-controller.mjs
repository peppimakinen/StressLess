import 'dotenv/config';
import fetch from 'node-fetch';
import {customError} from '../middlewares/error-handler.mjs';

// Kubios API base URL
const baseUrl = process.env.KUBIOS_API_URI;

/**
 * Handle GET request to check if specific date contains HRV data
 * @async
 * @param {Request} req Request object including Kubios id token
 * @param {Response} res
 * @param {NextFunction} next
 * @return {boolean} kubiosDataFound
 */
const checkDate = async (req, res, next) => {
  // Get data from Kubios API
  const desiredDate = req.params.date;
  // Start process to fetch data from Kubios Cloud
  const result = await retrieveDataForDate(req, desiredDate);
  // Check for error in result
  if (result.error) {
    next(customError('Kubios data could not be retrieved at this time', 500));
  } else {
    // Check how many measurements were fetched from Kubios
    const resultsLength = Object.keys(result.results).length;
    // Return a boolean depending on if data was found
    if (resultsLength === 0) {
      return res.json({kubiosDataFound: false});
    } else {
      return res.json({kubiosDataFound: true});
    }
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
    // Format dates
    const formattedFromDate = fromDate.toISOString();
    const formattedToDate = toDate.toISOString();
    // Fetch data from Kubios Cloud
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
    // Return response object, if no errors occurred
    } else {
      const data = await response.json();
      return data;
    }
  // Handle and return errors
  } catch (error) {
    return {error};
  }
};

export {checkDate, retrieveDataForDate};

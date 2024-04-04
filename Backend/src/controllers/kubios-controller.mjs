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
const getSpecificData = async (req, res, next) => {
  try {
    // Derive date from the URL
    const desiredDate = req.params.date;
    console.log('Fetching kubios data for a specific date...');
    // Establish headers
    const headers = new Headers();
    headers.append('User-Agent', process.env.KUBIOS_USER_AGENT);
    headers.append('Authorization', req.user.token);

    // Constructing from and to timestamps for the specific date
    const fromDate = new Date(desiredDate);
    fromDate.setUTCHours(0, 0, 0, 0); // Set to 00:00:00 UTC
    const toDate = new Date(desiredDate);
    toDate.setUTCHours(23, 59, 59, 999); // Set to 23:59:59.999 UTC

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
    const responseData = await response.json();
    // Check the length of the results list in the dictionary
    const resultsLength = Object.keys(responseData.results).length;
    if (!resultsLength) {
      console.log('No measurement was found');
      next(customError(`No kubios data found for ${desiredDate}`, 404));
    } else {
      console.log(`Daily measurement was found for ${desiredDate}!`);
      return res.json(responseData);
    }
  } catch (error) {
    console.log('getSpecificData', error);
    next(customError('Kubios data could not be retrieved at this time', 500));
  }
};

export {getAllUserData, getSpecificData};

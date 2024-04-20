import { fetchData } from './fetch.js';
import getReportByEntryId from '../Backend/report-AbortController.mjs';

// LOGOUT 
// const logout = document.querySelector('.logout');

const logout = function(evt) {
  evt.preventDefault();
  window.location.href = 'login.html';
};

logout.addEventListener('click', logout);



// fetching weeks dates

const getSpecificReport = async (req, res, next) => {

try {
    console.log('Entered getSpecificReport');
    const userId = req.user.user_id;
    const entryId = req.params.entry_id; 
    // Fetch report from database based on entryId
    const result = await getReportByEntryId(userId, entryId);
    // Check for errors
    if (result.error) {
      throw customError(result.message, result.error);
    }
    
    return res.json(result);
  // Handle errors
  } catch (error) {
    next(customError(error.message, error.status));
  }
  };

  const weekDates = function(evt) {
    evt.preventDefault();
    getSpecificReport()
}

document.getElementsByClassName('date').textContent = weekDates;

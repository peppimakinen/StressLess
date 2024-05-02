import promisePool from '../utils/database.mjs';

/**
 * Get survey for specific user ID
 * @async
 * @param {Int} userId
 * @return {Object} Result. Empty result is returned as error
 */
const getSurveyWithUserId = async (userId) => {
  try {
    const sql = `
    SELECT Questions.question, Questions.answer
    FROM Users
    JOIN Surveys ON Users.user_id = Surveys.u_id
    JOIN SQ ON Surveys.survey_id = SQ.s_id
    JOIN Questions ON SQ.q_id = Questions.question_id
    WHERE Users.user_id=?`;
    const [rows] = await promisePool.query(sql, userId);
    // Check if survey was found
    if (rows.length === 0) {
      // Return error if no survey
      return {error: 404, message: `No survey found with user_id=${userId}`};
    // Else return found survey
    } else {
      return rows;
    }
  } catch (error) {
    console.error('getSurveyWithUserId', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Get selected activities for specific user ID
 * @async
 * @param {Int} userId
 * @return {Object} Result. Empty result is returned as error
 */
const getOnlyActivities = async (userId) => {
  try {
    const sql = `
    SELECT Questions.answer
    FROM Users
    JOIN Surveys ON Users.user_id = Surveys.u_id
    JOIN SQ ON Surveys.survey_id = SQ.s_id
    JOIN Questions ON SQ.q_id = Questions.question_id
    WHERE Users.user_id=? AND Questions.question='Activity'`;
    const [rows] = await promisePool.query(sql, userId);
    // Check if activities were found
    if (rows.length === 0) {
      // Return a error if no activities
      return {error: 404, message: 'Activities not found'};
    } else {
      // Extracting only the 'answer' values from the array of objects
      const activities = rows.map((row) => row.answer);
      // Return activities
      return activities;
    }
  } catch (error) {
    console.error('getOnlyActivities', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Insert a new survey to Surveys
 * @async
 * @param {Int} userId
 * @return {Object} Result
 */
const createSurvey = async (userId) => {
  try {
    const sql = 'INSERT INTO Surveys (u_id) VALUES (?)';
    const [rows] = await promisePool.query(sql, userId);
    return rows;
  } catch (error) {
    console.log('createSurvey', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Insert a new a new question and answer pair to Questions
 * @async
 * @param {string} question Question from survey
 * @param {string} answer Answer from client
 * @return {Object} Result
 */
const addSurveyRow = async (question, answer) => {
  try {
    const sql = `INSERT INTO Questions (question, answer) VALUES (?,?)`;
    const params = [question, answer];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('addSurveyRow', error);
    return {error: 500, message: 'db error'};
  }
};

/**
 * Connect question and answer pair to a specific survey using the SQ table
 * @async
 * @param {Int} questionId
 * @param {Int} surveyId
 * @return {Object} Result
 */
const connectQuestionToSurvey = async (questionId, surveyId) => {
  try {
    const sql = `INSERT INTO SQ (q_id, s_id) VALUES (?,?)`;
    const params = [questionId, surveyId];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('connectQuestionToSurvey', error);
    return {error: 500, message: 'db error'};
  }
};

export {
  connectQuestionToSurvey,
  getSurveyWithUserId,
  getOnlyActivities,
  addSurveyRow,
  createSurvey,
};

import promisePool from '../utils/database.mjs';

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
    if (rows.length === 0) {
      return {error: 404, message: `No survey found with user_id=${userId}`};
    } else {
      return rows;
    }
  } catch (error) {
    console.error('getSurveyWithUserId', error);
    return {error: 500, message: 'db error'};
  }
};

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
    if (rows.length === 0) {
      return {error: 404, message: 'Activities not found'};
    } else {
      // Extracting only the 'answer' values from the array of objects
      const activities = rows.map((row) => row.answer);
      return activities;
    }
  } catch (error) {
    console.error('getSurveyWithUserId', error);
    return {error: 500, message: 'db error'};
  }
};

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

const addSurveyRow = async (question, answer) => {
  try {
    const sql = `INSERT INTO Questions (question, answer) VALUES (?,?)`;
    const params = [question, answer];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('getSurveyWithUserId', error);
    return {error: 500, message: 'db error'};
  }
};

const connectQuestionToSurvey = async (questionId, surveyId) => {
  try {
    const sql = `INSERT INTO SQ (q_id, s_id) VALUES (?,?)`;
    const params = [questionId, surveyId];
    const [rows] = await promisePool.query(sql, params);
    return rows;
  } catch (error) {
    console.error('getSurveyWithUserId', error);
    return {error: 500, message: 'db error'};
  }
};



export {
  getSurveyWithUserId,
  getOnlyActivities,
  addSurveyRow,
  createSurvey,
  connectQuestionToSurvey,
};

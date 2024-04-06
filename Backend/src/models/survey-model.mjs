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
      return {error: 404, message: 'Survey not found'};
    } else {
      return rows;
    }
  } catch (error) {
    console.error('getSurveyWithUserId', error);
    return {error: 500, message: 'db error'};
  }
};

export {getSurveyWithUserId};

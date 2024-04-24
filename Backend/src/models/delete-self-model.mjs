import promisePool from '../utils/database.mjs';
import {customError} from '../middlewares/error-handler.mjs';

/**
 * DELETE WeeklyReports data that belong to specific user ID
 * @async
 * @param {int} userId
 * @return {dict} result
 * @throws customError
 */
const deleteSelfFromWeeklyReports = async (userId) => {
  try {
    const sql = `DELETE FROM WeeklyReports WHERE user_id=?`;
    const [rows] = await promisePool.query(sql, [userId]);
    return rows;
  } catch (error) {
    console.error('Error in deleteSelfFromWeeklyReports:', error);
    throw customError('deleteSelfFromWeeklyReports error', 500);
  }
};

/**
 * DELETE all diary entry related data that belong to specific user ID
 * @async
 * @param {int} userId
 * @return {dict} result
 * @throws customError
 */
const deleteSelfEntryLinkedData = async (userId) => {
  try {
    const sql = `
      DELETE CompletedActivities, DM, Measurements
      FROM DiaryEntries
      LEFT JOIN CompletedActivities 
        ON DiaryEntries.entry_id = CompletedActivities.e_id
      LEFT JOIN DM ON DiaryEntries.entry_id = DM.e_id
      LEFT JOIN Measurements ON DM.m_id = Measurements.measurement_id
      WHERE DiaryEntries.user_id=?;
      `;
    const [rows] = await promisePool.query(sql, [userId]);
    return rows;
  } catch (error) {
    console.error('Error in deleteSelfEntryLinkedData:', error);
    throw customError('deleteSelfEntryLinkedData error', 500);
  }
};

/**
 * DELETE survey linked data that belong to specific user ID
 * @async
 * @param {int} userId
 * @return {dict} result
 * @throws customError
 */
const deleteSelfSurveyLinkedData = async (userId) => {
  try {
    const sql = `
      DELETE Questions, SQ
      FROM Questions
      LEFT JOIN SQ ON Questions.question_id = SQ.q_id
      LEFT JOIN Surveys ON SQ.s_id = Surveys.survey_id
      WHERE Surveys.u_id=?;`;
    const [rows] = await promisePool.query(sql, [userId]);
    return rows;
  } catch (error) {
    console.error('Error in deleteSelfSurveyLinkedData:', error);
    throw customError('deleteSelfSurveyLinkedData error', 500);
  }
};

/**
 * DELETE survey that belong to specific user ID
 * @async
 * @param {int} userId
 * @return {dict} result
 * @throws customError
 */
const deleteSelfFromSurveys = async (userId) => {
  try {
    const sql = `DELETE FROM Surveys WHERE u_id=?`;
    const [rows] = await promisePool.query(sql, [userId]);
    return rows;
  } catch (error) {
    console.error('Error in deleteSelfFromSurveys:', error);
    throw customError('deleteSelfFromSurveys error', 500);
  }
};

/**
 * DELETE doctor-patient pair for the specific patient ID
 * @async
 * @param {int} userId
 * @return {dict} result
 * @throws customError
 */
const deleteSelfFromDoctorPatientAsPatient = async (userId) => {
  try {
    const sql = `DELETE FROM DoctorPatient WHERE patient_id=?`;
    const [rows] = await promisePool.query(sql, [userId]);
    return rows;
  } catch (error) {
    console.error('Error in deleteSelfFromDoctorPatient:', error);
    throw customError('deleteSelfFromDoctorPatient error', 500);
  }
};

/**
 * DELETE doctor-patient pair for the specific doctor ID
 * @async
 * @param {int} userId
 * @return {dict} result
 * @throws customError
 */
const deleteSelfFromDoctorPatientAsDoctor = async (userId) => {
  try {
    const sql = `DELETE FROM DoctorPatient WHERE doctor_id=?`;
    const [rows] = await promisePool.query(sql, [userId]);
    return rows;
  } catch (error) {
    console.error('Error in deleteSelfFromDoctorPatient:', error);
    throw customError('deleteSelfFromDoctorPatient error', 500);
  }
};

/**
 * DELETE all diary entries for the specific user ID
 * @async
 * @param {int} userId
 * @return {dict} result
 * @throws customError
 */
const deleteSelfFromDiaryEntries = async (userId) => {
  try {
    const sql = `DELETE FROM DiaryEntries WHERE user_id=?`;
    const [rows] = await promisePool.query(sql, [userId]);
    return rows;
  } catch (error) {
    console.error('Error in deleteSelfFromDiaryEntries:', error);
    throw customError('deleteSelfFromDiaryEntries error', 500);
  }
};

/**
 * DELETE User from Users table
 * NOTE: This does not delete kubios account
 * @async
 * @param {int} userId
 * @return {dict} result
 * @throws customError
 */
const deleteSelfFromUsers = async (userId) => {
  try {
    const sql = `DELETE FROM Users WHERE user_id=?`;
    const [rows] = await promisePool.query(sql, [userId]);
    return rows;
  } catch (error) {
    console.error('Error in deleteSelfFromUsers:', error);
    throw customError('deleteSelfFromUsers error', 500);
  }
};

export {
  deleteSelfFromWeeklyReports,
  deleteSelfEntryLinkedData,
  deleteSelfSurveyLinkedData,
  deleteSelfFromSurveys,
  deleteSelfFromDoctorPatientAsPatient,
  deleteSelfFromDiaryEntries,
  deleteSelfFromDoctorPatientAsDoctor,
  deleteSelfFromUsers,
};

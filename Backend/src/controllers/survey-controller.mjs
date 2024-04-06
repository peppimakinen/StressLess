import {customError} from '../middlewares/error-handler.mjs';
import {getSurveyWithUserId} from '../models/survey-model.mjs';

const getOwnSurvey = async (req, res, next) => {
  const {user_id: userId, username} = req.user;
  console.log(`Retrieving survey made by ${username}`);
  const result = await getSurveyWithUserId(userId);
  if (!result.error) {
    console.log('Survey found', result);
    return res.json({survey: result});
  } else {
    console.log('Survey not found');
    next(
      customError(`There is no completed survey with user_id=${userId}`, 404),
    );
  }
};

const postSurvey = async (req, res, next) => {
  console.log('entered post surve');
};

export {getOwnSurvey, postSurvey};

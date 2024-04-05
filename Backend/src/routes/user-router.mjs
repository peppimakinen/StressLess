/* eslint-disable max-len */
import {validationErrorHandler} from '../middlewares/error-handler.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {body} from 'express-validator';
import express from 'express';
import {
  getUserById,
  getUsers,
  postDoctor,
  putUser,
  deleteUser,
} from '../controllers/user-controller.mjs';

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter
  .route('/')
  // list users
  .get(authenticateToken, getUsers)
  // update user
  .put(
    authenticateToken,
    body('username', 'Username is alphanumeric between 3-20 characters')
      .trim()
      .isLength({min: 3, max: 20})
      .isAlphanumeric(),
    body('password', 'Password should be between 3-128 characters')
      .trim()
      .isLength({min: 3, max: 128}),
    body('email', 'Invalid email address').trim().isEmail(),
    validationErrorHandler,
    putUser,
  );

// "/user/:id" endpoint
userRouter
  .route('/:id')
  // get info of a user
  .get(authenticateToken, getUserById)
  // delete user based on id
  .delete(authenticateToken, deleteUser);

// Only for application admin - authentication done with a enviorment variable
userRouter
  .route('/create-doctor')
  .post(body('username', 'Invalid email address').trim().isEmail(), postDoctor);

export default userRouter;

import {selectDoctorByEmail} from '../models/user-model.mjs';
import {customError} from '../middlewares/error-handler.mjs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const doctorPostLogin = async (req, res, next) => {
  const {username, password} = req.body;
  console.log('Doctor user accessing login...');
  const existingUser = await selectDoctorByEmail(username);
  if (existingUser.error) {
    console.log('No matching doctor user found in db');
    return next(
      customError(
        // eslint-disable-next-line max-len
        'User not found - Contact StressLess Admins if you think you should have access to this account',
        404,
      ),
    );
  }
  console.log('Found doctor user: ', existingUser.username);
  // compare password and hash, if match, login successful
  const match = await bcrypt.compare(password, existingUser.password);
  if (match) {
    delete existingUser.password;
    const token = jwt.sign({...existingUser}, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return res.json({
      message: 'Logged in successfully',
      ...existingUser,
      token,
    });
  } else {
    return next(customError('Invalid username or password', 401));
  }
};

export {doctorPostLogin};

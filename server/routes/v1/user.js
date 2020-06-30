import express from 'express';
import 'express-async-errors';
import {
  login,
  signup,
  resetPassword,
  changePassword,
  updateUser,
} from '../../controllers/user';
import middlewares from '../../middlewares';

const {
  validate,
  loginSchema,
  signUpSchema,
  changePasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  checkInvitation,
} = middlewares;

const userRoutes = express();

userRoutes.post('/login', validate(loginSchema), checkInvitation, login);
userRoutes.post('/signup', validate(signUpSchema), checkInvitation, signup);
userRoutes.patch('/update', validate(updateUserSchema), updateUser);
userRoutes.post(
  '/reset_password_link',
  validate(resetPasswordSchema),
  resetPassword
);
userRoutes.post(
  '/change_password/',
  validate(changePasswordSchema),
  changePassword
);

export default userRoutes;

import Sequelize from 'sequelize';
import models from '../database/models';
import helpers from '../helpers';
import Mail from '../services/mail/email';
import { generateToken, verifyToken } from '../helpers/auth';

const userRepository = new dbRepository(models.User);
const { successStat, errorStat, comparePassword } = helpers;
const { Op } = Sequelize;

/**
 * / @static
 * @description Allows a user to sign in
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const login = async (req, res) => {
  const { email, password } = req.body.user;
  const user = await models.User.findOne({ where: { email } });

  if (!user) return errorStat(res, 401, 'Incorrect Login information');

  const matchPasswords = comparePassword(password, user.password);

  if (!matchPasswords) {
    return errorStat(res, 401, 'Incorrect Login information');
  }

  await req.session.login(user.role, { user: user.dataValues }, res);
  let message = 'Login successful';

  return successStat(res, 200, 'user', { ...user.userResponse(), message });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const signup = async (req, res) => {
  const { email } = req.body.user;
  const isExist = await models.User.findOne({ where: { email } });

  if (isExist) return errorStat(res, 409, 'User Already Exist');

  if (isUserName) return errorStat(res, 409, 'UserName Already Exist');

  const user = await models.User.create({
    role: 'user',
  });

  const token = generateToken(
    { id: user.id, email },
    { expiresIn: 60 * 60 * 24 * 3 }
  );

  const link = `${req.protocol}/${req.headers.host}/api/v1/user/confirm_email?emailToken=${token}&id=${user.dataValues.id}`;

  const mail = new Mail({
    to: email,
    subject: 'Welcome to Elegant Columns',
    messageHeader: `Hi, ${user.firstname}!`,
    messageBody:
      'We are exicted to get you started. First, you have to verify your account. Just click on the link below',
    iButton: true,
  });
  mail.InitButton({
    text: 'Verify Email',
    link: link,
  });
  mail.sendMail();

  await req.session.login(user.role, { user: user.dataValues }, res);
  let message = 'Registration is successful';

  return successStat(res, 201, 'user', { ...user.userResponse(), message });
};

/**
 * @static
 * @description Update user profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data
 * @memberof UserController
 */
export const updateUser = async (req, res) => {
  const { userName } = req.body.user;

  if (!req.session.user) {
    return errorStat(res, 403, 'Unauthorize Access. Please login.');
  }

  const { id } = req.session.user;

  const user = await models.User.findOne({
    where: { id },
  });

  if (userName) {
    const isUser = await models.User.findOne({
      where: { userName },
    });
    if (isUser) {
      if (isUser.id !== user.id) {
        return errorStat(res, 409, 'Username already exist');
      }
    }
  }

  await user.update({ ...req.body.user });

  return successStat(res, 200, 'user', { ...user.userResponse() });
};

/**
 * @description Allows a user to resend password link
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */

export const resetPassword = async (req, res) => {
  let { email } = req.body.user;

  const findUser = await models.User.findOne({ where: { email } });

  if (!findUser) return errorStat(res, 404, 'User does not exist');

  const token = generateToken(
    { id: findUser.id, email },
    { expiresIn: 60 * 15 }
  );

  const link = `${req.protocol}/${req.headers.host}/api/v1/user/change_password?emailToken=${token}&id=${findUser.id}`;

  const mail = new Mail({
    to: email,
    subject: 'Reset Password',
    messageHeader: `Hi, ${user.firstname}!`,
    messageBody: 'Please Click on the link below to reset your password',
    iButton: true,
  });
  mail.InitButton({
    text: 'Reset password',
    link: link,
  });
  mail.sendMail();

  return successStat(
    res,
    200,
    'Message',
    'Reset passord link has been sent to your email, clik link to activate your account'
  );
};

/**
 * @static
 * @description Allows a user to change password
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */

export const changePassword = async (req, res) => {
  const { emailToken, id, resend } = req.query;

  const { password } = req.body;

  const findUser = await await models.User.findOne({ where: { id } });

  if (!findUser) return errorStat(res, 401, 'Password reset unsuccesful');

  try {
    verifyToken(emailToken);
  } catch (err) {
    if (!findUser) return errorStat(res, 401, 'Link expired');
  }

  await findUser.update({
    password,
  });

  return successStat(res, 200, 'Message', 'Your password has been changed');
};

/**
 * @static
 * @description Send a user email on successful registration
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const confirmEmail = async (req, res) => {
  const { token, id, resend } = req.query;
  if (resend) {
    const user = await models.User.findOne({ where: { id } });

    if (!user) return errorStat(res, 400, 'Unable to send verification email');
    const mail = new Mail({
      to: user.email,
      subject: 'Welcome email',
      messageHeader: `Hi, ${user.firstname}!`,
      messageBody:
        'We are exicted to get you started. First, you have to verify your account. Just click on the link below',
      iButton: true,
    });
    mail.InitButton({
      text: 'Verify Email',
      link: `${process.env.APP_URL}/api/v1/users/confirmEmail?token=${token}&id=${user.id}`,
    });
    mail.sendMail();
    return successStat(
      res,
      200,
      'message',
      'Verification link has been sent to your email'
    );
  }
  try {
    const verify = await verifyToken(token, (err, decoded) => decoded);
    await models.User.update({ verified: true }, { where: { id: verify.id } });
    res.redirect(200, process.env.FRONTEND_URL);
    return successStat(res, 200, 'message', 'Email verified successfully');
  } catch (err) {
    return errorStat(res, 400, 'Unable to verifiy email');
  }
};

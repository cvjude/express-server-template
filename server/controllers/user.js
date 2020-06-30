import crypto from 'crypto';
import Sequelize from 'sequelize';
import models from '../database/models';
import helpers from '../helpers';
import Mail from '../services/mail/email';
import dbRepository from '../helpers/dbRepository';

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

  const emailToken = crypto.randomBytes(64).toString('hex');

  const date = new Date().setMinutes(40);

  const user = await models.User.create({
    role: 'user',
  });

  const link = `${req.protocol}/${req.headers.host}/api/v1/user/confirm_email?emailToken=${emailToken}&id=${user.dataValues.id}`;

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
  const { firstName, lastName, userName, bio } = req.body.user;

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

  await user.update({
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    inAppNotify: req.body.inAppNotify || user.inAppNotify,
    emailNotify: req.body.emailNotify || user.emailNotify,
  });

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
  let { email } = req.body;

  email = email.toLowerCase();

  const findUser = await userRepository.getOne({ email });

  if (!findUser) return errorStat(res, 404, 'User does not exist');

  const emailToken = crypto.randomBytes(64).toString('hex');

  const date = new Date().setMinutes(40);

  await userRepository.updateOne(
    { emailVerification: emailToken, expiredAt: date },
    { email }
  );

  const link = `${req.protocol}//${req.headers.host}/api/v1/user/confirm_email?emailToken=${emailToken}&id=${findUser.id}`;
  await sendEmail(
    email,
    'Paxinfy Email Verification',
    `Please kindly click on the link below to verify your account <br/> ${link}`
  );

  return successStat(
    res,
    200,
    'Message',
    'Resent passord link has been sent to your email, clik link to activate your account'
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
  const { emailToken } = req.query;

  const { password } = req.body;
  const condition = {
    emailVerification: emailToken,
    expiredAt: { [Op.gt]: new Date() },
  };

  const findUser = await userRepository.getOne(condition);

  if (!findUser) return errorStat(res, 401, 'Password reset unsuccesful');

  await await userRepository.updateOne(
    {
      password,
      emailVerification: null,
      expiredAt: null,
    },
    { emailVerification: emailToken }
  );

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
    return successStat(res, 200, 'message', 'Email verified successfully');
  } catch (err) {
    return errorStat(res, 400, 'Unable to verifiy email');
  }
};

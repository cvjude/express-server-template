import helpers from '../helpers';

const { errorStat } = helpers;

/**
 * @description The isLogged in middleware
 * @param {Object} req - the req object
 *  @param {function} res - the res object
 * @returns {Object} verified token
 * @memberof Auth
 */
export const isLoggedIn = async (req, res) => {
  try {
    await req.session.isLoggedIn(req, res);
  } catch (err) {
    return errorStat(res, 401, err.message);
  }
};

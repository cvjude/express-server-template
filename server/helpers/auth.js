import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
// import { errorStat } from './Utilities';

config();
const secret = process.env.APP_SECRET;

/**
 * @description Generates a jwt token
 * @param {Object} payload - Details to encode in the token
 * @returns {string} Generated token
 * @memberof Auth
 */
export async function generateToken(payload, cb) {

  const token = jwt.sign(payload, secret, cb);
  return token;
}

/**
 * @description Verify a jwt token
 * @param {Object} token - Token to be verified
 *  @param {function} callBack - call back method to jwt
 * @returns {Object} verified token
 * @memberof Auth
 */
export async function verifyToken(token, callBack) {
  return jwt.verify(token, secret, callBack);
}

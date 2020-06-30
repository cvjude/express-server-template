import bcrypt from 'bcryptjs';

/**
 * @static
 * @description Allows a user to sign up
 * @param {String} password - Password to be hashed
 * @returns {String} Encrypted password
 * @memberof Helper
 */
export function hashPassword(password) {
  return bcrypt.hash(password, 6);
}

/**
 * @static
 * @description Allows a user to sign up
 * @param {String} password - Request object
 * @param {String} hashed - Response object
 * @returns {Boolean} Returns true if the password is correct
 * @memberof Helper
 */
export function comparePassword(password, hashed) {
  return bcrypt.compareSync(password, hashed);
}

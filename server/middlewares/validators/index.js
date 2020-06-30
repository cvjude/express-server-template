import helpers from '../../helpers';

const { validateJoi } = helpers;

/**
 * @method validateUser
 * @description Validates user details on login
 * @param {object} schema - The Request Object
 *@param {function} cb - Optional object for transformation
 * @param {object} req - The Request Object
 * @param {object} res - The Response Object
 * @param {function} next - The next function to point to the next middleware
 * @returns {function} validate() - An execucted validate function
 */
export default (schema, cb) => (req, res, next) => {
  let route = req.baseUrl.slice(8);
  route = route.substr(route.indexOf('/') + 1);

  cb = cb || function () {};
  cb(req);

  return validateJoi(
    { ...req.body, ...req.query, ...req.params },
    schema,
    req,
    res,
    next,
    route
  );
};

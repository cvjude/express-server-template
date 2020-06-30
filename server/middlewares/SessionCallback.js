import { Op } from 'sequelize';
import models from '../database/models';

/**
 * / @static
 * @description middleware for chexking is a user is the owner of a resource
 * @param {Object} model - the model  to check for the resource
 * @param {Object} resource - the resource paramater, e.g {id: courseId} or {slug: 'its-me'}
 * @param {Object} id - the users id
 * @returns {bool} if the user is a staff
 */
const isOwner = async (model, resource, id) => {
  const owner = await models[model].findOne({
    where: { [Op.and]: [resource, { ownerId: id }] },
  });

  return !!owner;
};

/**
 * / @static
 * @description middleware for validating the owner, and who ever has permission
 * @param {Object} id - the owner Id
 * @param {Object} model - the model for which to find the owner
 * @param {Object} resourceId - the id of the reource for which you are looking for the owner
 * @param {Object} type - the type of permission that a user should have before accessing the route
 * @returns {bool} if the user should access the route
 */
const allow = async (id, model, resourceId, type) => {
  let activePersimssion;

  const owner = await isOwner(model, { id: resourceId }, id);

  const hasPermission = await models.Permissions.findOne({
    where: {
      [Op.and]: [
        { resourceId },
        { userId: id },
        { [Op.or]: [{ type: '*' }, { type }] },
      ],
    },
  });

  if (hasPermission) {
    activePersimssion = hasPermission.expires > new Date();
    if (!activePersimssion) {
      await models.Permissions.destroy({
        where: { [Op.and]: [{ resourceId }, { userId: id }] },
      });
    }
  }

  return owner || (!!hasPermission && activePersimssion);
};

/**
 * / @static
 * @description middleware for is a user is a staff
 * @param {Object} organizationId - the organization Id
 * @param {Object} userId - the users Id
 * @returns {bool} if the user is a staff
 */
const isStaff = async (organizationId, userId) => {
  const staff = await models.Staff.findOne({
    where: { [Op.and]: [{ organizationId }, { userId }] },
  });

  return !!staff;
};

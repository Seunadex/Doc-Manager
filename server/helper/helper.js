import bcrypt from 'bcryptjs';

/**
 * @export
 * @param {String} password
 * @returns {String} password
 */
export function passwordHash(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/**
 * @description verifies the user logged in
 * @export
 * @param {Integer} id id of the user being queried for
 * @param {Integer} userId id of the user logged in
 * @returns {boolean} returns true or false
 */
export function isUser(id, userId) {
  return id === userId;
}


/**
 * @description checks if a user is admin or not
 * @export
 * @param {Integer} roleId
 * @returns {Boolean} returns true or false
 */
export function isAdmin(roleId) {
  return roleId === 1;
}

/**
 * @description generates user details
 * @export
 * @param {Object} user
 * @returns {Object} returns generated user object
 */
export function generateUserDetails(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}


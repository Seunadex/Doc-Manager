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

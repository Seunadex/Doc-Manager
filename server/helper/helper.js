import bcrypt from 'bcryptjs';

/**
 * @export
 * @param {String} password
 * @returns {String} password
 */
export default function passwordHash(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}


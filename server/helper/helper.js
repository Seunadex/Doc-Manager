import moment from 'moment';
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
 * @export
 * @param {String} date
 * @returns {Date} date
 */
export function formatDate(date) {
  if (date) {
    return moment(date).format('ddd, MMM Do YYYY, h:mm:ss a');
  }
}

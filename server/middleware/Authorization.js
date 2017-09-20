import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import errorMsg from '../helper/errorMsg';

const { userError } = errorMsg;

dotenv.config();

/**
 * authorization class
 * @class Authorization
 */
export default class Authorization {

  /**
   * @description verify authentication
   * @param {object} request request from client
   * @param {object} response server response
   * @param {callback} next
   * @memberof Authorization
   * @returns {void}
   */
  static verifyUser(request, response, next) {
    const secret = process.env.SECRET;
    const bearerHeader = request.headers.authorization;
    if (bearerHeader) {
      jwt.verify(bearerHeader, secret, (err, decoded) => {
        if (err) {
          return response.status(401).send({ message: 'Invalid token' });
        }
        request.decoded = decoded;
        next();
      });
    } else {
      return response.status(401).send({
        message: 'Oops! You are not authenticated, Please Log in'
      });
    }
  }

  /**
   * @description verify if a logged in user is an admin
   * @param {Object} request request from client
   * @param {Object} response server response
   * @param {Object} next
   * @returns {void}
   * @memberof Authorization
   */
  static verifyAdmin(request, response, next) {
    if (request.decoded.userRoleId === 1) {
      return next();
    }
    return response.status(403).send({
      message: 'Only Admin permitted to access this route!' });
  }

  /**
   * @description verify currently authenticated user
   * @param {Object} request request from client
   * @param {Object} response server response
   * @param {callback} next
   * @returns {void}
   * @memberof Authorization
   */
  static verifyCurrentUser(request, response, next) {
    if (isNaN(request.params.id)) {
      return response.status(400).send({
        message: userError.idIsNumber
      });
    }
    if (Number(request.params.id) === parseInt(request.decoded.userId, 10)) {
      return next();
    }
    return response.status(403).send({
      message: 'Oops! You are not allowed to update the user'
    });
  }
}

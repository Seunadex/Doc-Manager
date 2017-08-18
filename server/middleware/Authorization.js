import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';
import errorMsg from '../helper/errorMsg';

const { userError, serverError } = errorMsg;

dotenv.config();

/**
 * authorization class
 * @class Authorization
 */
class Authorization {

  /**
   * @description verify authentication
   * @param {object} request
   * @param {object} response
   * @param {callback} next
   * @memberof Authorization
   * @returns {void}
   */
  verifyUser(request, response, next) {
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
   * @description finds user by id
   * @param {Object} request
   * @param {Object} response
   * @param {Object} next
   * @returns {void}
   * @memberof Authorization
   */
  findById(request, response, next) {
    if (isNaN(request.params.id)) {
      return response.status(400).send({
        message: userError.idIsNumber
      });
    }
    models.User.findById(request.params.id)
    .then((user) => {
      if (!user) {
        return response.status(404).send({
          message: 'User not found'
        });
      }
      next();
    })
    .catch(() => response.status(500).send({
      message: serverError.internalServerError
    }));
  }


  /**
   * @description verify currently authenticated user
   * @param {Object} request
   * @param {Object} response
   * @param {callback} next
   * @returns {void}
   * @memberof Authorization
   */
  verifyCurrentUser(request, response, next) {
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

  /**
   *
   * @description finds documents by id
   * @param {Object} request
   * @param {Object} response
   * @param {Callback} next
   * @returns {void}
   * @memberof Authorization
   */
  findDocumentById(request, response, next) {
    if (isNaN(Number(request.params.id))) {
      return response.status(400).json({
        message: 'Invalid document id'
      });
    }
    models.Document.findById(request.params.id)
      .then((document) => {
        if (!document) {
          return response.status(404).send({
            message: 'Document not found'
          });
        }

        next();
      })
      .catch(() => response.status(500).send({
        message: serverError.internalServerError
      }));
  }
}
export default new Authorization();

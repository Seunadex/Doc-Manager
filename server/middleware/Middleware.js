import dotenv from 'dotenv';
import models from '../models';
import { isUser } from '../helper/helper';
import errorMsg from '../helper/errorMsg';

const { userError, serverError } = errorMsg;

dotenv.config();

/**
 * Middleware class
 * @class Middleware
 */
export default class Middleware {

  /**
   * @description finds user by id
   * @param {Object} request request from client
   * @param {Object} response server response
   * @param {Object} next
   * @returns {void}
   * @memberof Middleware
   */
  static findUser(request, response, next) {
    if (isNaN(request.params.id)) {
      return response.status(400).send({
        message: userError.idIsNumber
      });
    }
    models.User.findById(request.params.id)
    .then((user) => {
      if (!user) {
        return response.status(404).send({
          message: 'User Not Found'
        });
      }
      next();
    })
    .catch(() => response.status(500).send({
      message: serverError.internalServerError
    }));
  }

  /**
   *
   * @description finds documents by id
   * @param {Object} request request from client
   * @param {Object} response server response
   * @param {Callback} next
   * @returns {void}
   * @memberof Middleware
   */
  static findDocument(request, response, next) {
    if (isNaN(Number(request.params.id))) {
      return response.status(400).json({
        message: 'Invalid document id'
      });
    }
    models.Document.findById(request.params.id)
      .then((document) => {
        if (!document) {
          return response.status(404).send({
            message: 'Document does not exist'
          });
        }
        if (!isUser(request.decoded.userId, document.userId)) {
          return response.status(403).send({
            message: "You don't have permission to update this document"
          });
        }

        next();
      })
      .catch(() => response.status(500).send({
        message: serverError.internalServerError
      }));
  }
}

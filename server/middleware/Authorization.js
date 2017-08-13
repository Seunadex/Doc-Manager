import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';

dotenv.config();

/**
 * authorization class
 * @class Authorization
 */
class Authorization {

  /**
   * @description verify authentication
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @memberof Authorization
   * @returns {void}
   */
  verifyUser(req, res, next) {
    const secret = process.env.SECRET;
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
      jwt.verify(bearerHeader, secret, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'Invalid token' });
        }
        req.decoded = decoded;
        next();
      });
    } else {
      return res.status(403).send({
        status: 'Forbidden',
        message: 'Please Log in'
      });
    }
  }

  /**
   * @description finds user by id
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   * @returns {void}
   * @memberof Authorization
   */
  findById(req, res, next) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        message: 'id must be a number'
      });
    }
    models.User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found'
        });
      }
      next();
    })
    .catch(() => res.status(500).send({
      message: 'Internal server error'
    }));
  }


  /**
   * @description verify currently authenticated user
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {void}
   * @memberof Authorization
   */
  verifyCurrentUser(req, res, next) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        message: 'Id must be a number'
      });
    }
    if (Number(req.params.id) === parseInt(req.decoded.userId, 10)) {
      return next();
    }
    return res.status(401).send({
      message: 'Oops! You are not allowed to update the user'
    });
  }

  /**
   *
   * @description finds documents by id
   * @param {Object} req
   * @param {Object} res
   * @param {Callback} next
   * @returns {void}
   * @memberof Authorization
   */
  findDocumentById(req, res, next) {
    if (isNaN(Number(req.params.id))) {
      return res.status(400).json({
        message: 'Invalid document id'
      });
    }
    models.Document.findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({
            message: 'Document not found'
          });
        }

        next();
      })
      .catch(() => res.status(500).send({
        message: 'Internal server error'
      }));
  }
}
export default new Authorization();

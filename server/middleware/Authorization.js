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
   *
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
        res.locals.decoded = decoded;
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
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {void}
   * @memberof Authorization
   */
  AllowAdminOrUser(req, res, next) {
    return models.User.findById(req.params.id)
      .then((user) => {
        if (!user) return res.status(404).send({ message: 'User not found' });

        if (res.locals.decoded.userRoleId === 1
          || res.locals.decoded.userId === user.id) {
          res.locals.user = user;
          return next();
        }
        return res.status(403).send({ message: 'Access denied' });
      })
      .catch(() => res.status(403).send({ message: 'Access denied' }));
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {void}
   * @memberof Authorization
   */
  verifyAdmin(req, res, next) {
    if (res.locals.decoded.userRoleId === 1) {
      return next();
    }
    return res.status(403).send({ message: 'Only Admin permitted' });
  }


  /**
   * @param {Object} req
   * @param {Object} res
   * @param {callback} next
   * @returns {void}
   * @memberof Authorization
   */
  checkUser(req, res, next) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        message: 'Id must be a number'
      });
    }
    if (Number(req.params.id) === parseInt(res.locals.decoded.userId, 10)) {
      return next();
    }
    return res.status(403).send({
      message: 'Oops! You are not allowed to update the user'
    });
  }
}
export default new Authorization();

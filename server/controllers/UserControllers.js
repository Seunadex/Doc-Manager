import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import _ from 'lodash';
import pagination from '../helper/pagination';
import { User, Document } from '../models';
import { isUser } from '../helper/helper';
import jwtHelper from '../helper/jwtHelper';

dotenv.config();

const secret = process.env.SECRET;

const UserControllers = {
  /**
   * @description Creates a new user.
   * @param {Object} req
   * @param {Object} res response object containing user details
   * @returns {Object} returns the response object
   */
  create(req, res) {
    const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    return User.create({
      password,
      fullName: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
    })
    .then((user) => {
      const token = jwt.sign({
        userId: user.id,
        userFullName: user.fullName,
        userUsername: user.username,
        userEmail: user.email,
        userRoleId: user.roleId,
      }, secret, {
        expiresIn: '72h'
      });
      const userDetails = _.pick(user, [
        'id',
        'fullName',
        'username',
        'email',
        'roleId'
      ]);
      return res.status(201).send({
        userDetails,
        token,
      });
    })
    .catch(() => res.status(409).send({
      message: 'User credentials already exist',
    }));
  },
/**
   * @description Logs a user in after Authentication.
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   * containing the user's login details
   */
  login(req, res) {
    return User.findOne({
      where: {
        username: req.body.username
      }
    }).then((user) => {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      const passkey = bcrypt.compareSync(req.body.password, user.password);
      if (passkey) {
        const token = jwtHelper(user);
        return res.status(200).send({
          User: {
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.roleId,
            createdAt: user.createdAt
          },
          token,
        });
      }
      return res.status(401).send({ message: 'Incorrect password' });
    })
      .catch(error => res.status(500).send(error.message));
  },


  /**
   * @description Gets the list of users with pagination
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   * containing list of users with pagination
   */
  index(req, res) {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;

    if (isNaN(limit) || isNaN(offset)) {
      return res.status(400).send({
        message: 'limit and offset must be an integer'
      });
    }
    return User.findAndCount({
      limit,
      offset,
      attributes: [
        'id',
        'fullName',
        'username',
        'email',
        'roleId',
        'createdAt'
      ],
    })
    .then(user => res.status(200).send({
      Users: user.rows,
      paginationDetails: pagination(user.count, limit, offset)
    }))
    .catch(error => res.status(500).send(error.message));
  },


  /**
   * @description Search for users by their username
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   * containing the list of user registered
   */
  search(req, res) {
    let searchKey = '%%';
    if (req.query.q) {
      searchKey = `%${req.query.q}%`;
    }

    return User
    .findAll({
      where: { username: {
        $iLike: searchKey
      } },
      order: [['createdAt', 'DESC']]
    })
    .then(users => res.status(200).send({
      count: users.length,
      userList: users.map(user => (
        {
          username: user.username,
          fullName: user.fullName,
          createdAt: user.createdAt
        }))
    }))
    .catch(error => res.status(400).send(error.message));
  },

  /**
   * @description Gets a particular user by their id.
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   */
  show(req, res) {
    if (!isUser(Number(req.params.id), req.decoded.userId) &&
      (req.decoded.userRoleId !== 1)) {
      return res.status(401).send({
        message: 'Oops, You are not allowed to view this page'
      });
    }
    User.findById(req.params.id)
      .then(user => res.status(200).send({
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    .catch(() => res.status(404).send({
      message: 'User not found'
    }));
  },

  /**
   * @description Updates a user profile
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   */
  update(req, res) {
    User.findById(req.params.id)
    .then((user) => {
      User.findAll({
        where: {
          $or: [{
            email: req.body.email
          }, {
            username: req.body.username
          }]
        }
      })
      .then((authenticatedUser) => {
        if (authenticatedUser.length
            && (authenticatedUser[0].dataValues.id !==
              parseInt(req.params.id, 10))) {
          return res.status(409).send({
            message: 'A user exist with same email or username'
          });
        }
        const userDetails = _.pick(user, [
          'fullName',
          'username',
          'email',
          'roleId'
        ]);
        return user.update({
          fullName: req.body.fullName || user.fullName,
          username: req.body.username || user.username,
          email: req.body.email || user.email,
          password: bcrypt.hashSync(req.body.password,
            bcrypt.genSaltSync(10)) || user.password,
        })
        .then(() => res.status(200).send({
          userDetails,
        }));
      })
    .catch(() => res.status(500).send({
      message: 'Internal server error'
    }));
    }
    );
  },

  /**
   * @description Deletes a user account
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   * containing a message that a user has been deleted
   */
  destroy(req, res) {
    return User.findById(req.params.id)
    .then((user) => {
      if (!isUser(Number(req.params.id), req.decoded.userId) &&
        (req.decoded.userRoleId !== 1)) {
        return res.status(403).send({
          message: 'You Are not authorized to delete this user',
        });
      }
      return user.destroy()
        .then(() => res.status(200).send({
          message: 'User successfully deleted'
        }));
    });
  },

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object containing
   * the list to documents belonging to a certain user.
   */
  listUserDocuments(req, res) {
    Document.findAll()
      .then((response) => {
        const count = response.length;
        const offset = req.query.offset || 0;
        const limit = req.query.limit || 10;

        return Document.findAll({
          where: {
            userId: req.params.id
          },
          limit,
          offset,
        })
          .then((documents) => {
            if (documents.length === 0) {
              return res.status(404).send({
                message: 'No document found for this user'
              });
            }
            return res.status(200).send({
              documents,
              paginationDetails: pagination(count, limit, offset),
            });
          });
      });
  }
};

export default UserControllers;

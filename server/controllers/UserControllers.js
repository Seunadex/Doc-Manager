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
   * @param {Object} request
   * @param {Object} response response object containing user details
   * @returns {Object} returns the response object
   */
  create(request, response) {
    const password = bcrypt.hashSync(request.body.password,
      bcrypt.genSaltSync(10));
    return User.create({
      password,
      fullName: request.body.fullName,
      username: request.body.username,
      email: request.body.email,
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
      return response.status(201).send({
        userDetails,
        token,
      });
    })
    .catch(() => response.status(409).send({
      message: 'User credentials already exist',
    }));
  },
/**
   * @description Logs a user in after Authentication.
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns a response object
   * containing the user's login details
   */
  login(request, response) {
    return User.findOne({
      where: {
        username: request.body.username
      }
    }).then((user) => {
      if (!user) {
        return response.status(400).send({ message: 'User not found' });
      }
      const passkey = bcrypt.compareSync(request.body.password, user.password);
      if (passkey) {
        const token = jwtHelper(user);
        return response.status(200).send({
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
      return response.status(401).send({ message: 'Incorrect password' });
    })
      .catch(error => response.status(500).send(error.message));
  },


  /**
   * @description Gets the list of users with pagination
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns a response object
   * containing list of users with pagination
   */
  index(request, response) {
    const limit = request.query.limit || 10;
    const offset = request.query.offset || 0;

    if (isNaN(limit) || isNaN(offset)) {
      return response.status(400).send({
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
    .then(user => response.status(200).send({
      Users: user.rows,
      paginationDetails: pagination(user.count, limit, offset)
    }))
    .catch(error => response.status(500).send(error.message));
  },


  /**
   * @description Search for users by their username
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns a response object
   * containing the list of user registered
   */
  search(request, response) {
    let searchKey = '%%';
    if (request.query.q) {
      searchKey = `%${request.query.q}%`;
    }

    return User
    .findAll({
      where: { username: {
        $iLike: searchKey
      } },
      order: [['createdAt', 'DESC']]
    })
    .then(users => response.status(200).send({
      count: users.length,
      userList: users.map(user => (
        {
          username: user.username,
          fullName: user.fullName,
          createdAt: user.createdAt
        }))
    }))
    .catch(error => response.status(400).send(error.message));
  },

  /**
   * @description Gets a particular user by their id.
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns a response object
   */
  show(request, response) {
    if (!isUser(Number(request.params.id), request.decoded.userId) &&
      (request.decoded.userRoleId !== 1)) {
      return response.status(401).send({
        message: 'Oops, You are not allowed to view this page'
      });
    }
    User.findById(request.params.id)
      .then(user => response.status(200).send({
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    .catch(() => response.status(404).send({
      message: 'User not found'
    }));
  },

  /**
   * @description Updates a user profile
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns a response object
   */
  update(request, response) {
    User.findById(request.params.id)
    .then((user) => {
      User.findAll({
        where: {
          $or: [{
            email: request.body.email
          }, {
            username: request.body.username
          }]
        }
      })
      .then((authenticatedUser) => {
        if (authenticatedUser.length
            && (authenticatedUser[0].dataValues.id !==
              parseInt(request.params.id, 10))) {
          return response.status(409).send({
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
          fullName: request.body.fullName || user.fullName,
          username: request.body.username || user.username,
          email: request.body.email || user.email,
          password: bcrypt.hashSync(request.body.password,
            bcrypt.genSaltSync(10)) || user.password,
        })
        .then(() => response.status(200).send({
          userDetails,
        }));
      })
    .catch(() => response.status(500).send({
      message: 'Internal server error'
    }));
    }
    );
  },

  /**
   * @description Deletes a user account
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns a response object
   * containing a message that a user has been deleted
   */
  destroy(request, response) {
    return User.findById(request.params.id)
    .then((user) => {
      if (!isUser(Number(request.params.id), request.decoded.userId) &&
        (request.decoded.userRoleId !== 1)) {
        return response.status(403).send({
          message: 'You Are not authorized to delete this user',
        });
      }
      return user.destroy()
        .then(() => response.status(200).send({
          message: 'User successfully deleted'
        }));
    });
  },

  /**
   * @param {Object} request
   * @param {Object} response
   * @returns {Object} returns a response object containing
   * the list to documents belonging to a certain user.
   */
  listUserDocuments(request, response) {
    Document.findAll()
      .then((result) => {
        const count = result.length;
        const offset = request.query.offset || 0;
        const limit = request.query.limit || 10;

        return Document.findAll({
          where: {
            userId: request.params.id
          },
          limit,
          offset,
        })
          .then((documents) => {
            if (documents.length === 0) {
              return response.status(404).send({
                message: 'No document found for this user'
              });
            }
            return response.status(200).send({
              documents,
              paginationDetails: pagination(count, limit, offset),
            });
          });
      });
  }
};

export default UserControllers;

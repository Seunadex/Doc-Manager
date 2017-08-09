import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pagination from '../helper/pagination';
import { User, Document } from '../models';

dotenv.config();

const secret = process.env.SECRET;

const UserControllers = {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   */
  create(req, res) {
    const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    return User.create({
      password,
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
    })
    .then((user) => {
      const token = jwt.sign({
        userId: user.id,
        userFullname: user.fullname,
        userUsername: user.username,
        userEmail: user.email,
        userRoleId: user.roleId,
      }, secret, {
        expiresIn: '72h'
      });
      return res.status(201).send({
        message: 'User successfully created',
        success: true,
        user,
        token,
      });
    })
    .catch(() => res.status(400).send({
      message: 'User credentials already exist',
    }));
  },
/**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object containing the user's login details
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
        const token = jwt.sign({
          userId: user.id,
          userFullname: user.fullname,
          userUsername: user.username,
          userEmail: user.email,
          userRoleId: user.roleId,
        }, secret, {
          expiresIn: '24h'
        });
        return res.status(200).send({
          status: 'ok',
          success: true,
          message: 'You are successfully logged in',
          userId: user.id,
          token,
        });
      }
      return res.status(400).send({ message: 'Incorrect password' });
    })
      .catch(error => res.send(error.message));
  },


  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object containing list of users with pagination
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
      attributes: ['id', 'fullname', 'username', 'email', 'roleId'],
    })
    .then(user => res.status(200).send({
      pagination: {
        row: user.rows,
        paginationDetails: pagination(user.count, limit, offset)
      }
    }))
    .catch(error => res.status(403).send(error.message));
  },


  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object containing the list of user registered
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
      status: 'OK',
      count: users.length,
      userList: users.map(user => (
        {
          id: user.id,
          fullname: user.fullname,
          username: user.username,
          email: user.email,
          role: user.roleId,
          created_at: user.createdAt
        }))
    }))
    .catch(error => res.status(400).send(error.message));
  },

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   */
  show(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        status: 'error',
        message: 'id must be a number'
      });
    }
    return User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: 'error',
          message: 'User not found',
        });
      }
      req.user = user;
      return res.status(200).send({
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    })
    .catch(() => res.status(400).send({
      message: 'Invalid param'
    }));
  },

  /**
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
            && (authenticatedUser[0].dataValues.id !== parseInt(req.params.id, 10))) {
          return res.status(400).send({
            message: 'A user exist with same email or username'
          });
        }
        return user.update({
          fullname: req.body.fullname || user.fullname,
          username: req.body.username || user.username,
          email: req.body.email || user.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)) || user.password,
        })
        .then(() => res.status(200).send({
          status: 'Successfully updated',
          user,
        }))
        .catch(() => res.status(404).send({
          message: 'User not found'
        }
        ));
      })
    .catch(() => res.status(404).send({
      message: 'User not found'
    }));
    }
    );
  },

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object containing a message that a user has been deleted
   */
  destroy(req, res) {
    return User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }
      return user.destroy()
        .then(() => res.status(200).send({
          status: 'ok',
          message: 'You have successfully deleted a user'
        }))
        .catch(() => res.status(400).send({
          message: 'Please check your input'
        }));
    })
    .catch(() => res.status(400).send({
      message: 'Bad request'
    }));
  },

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   * containing the list to documents belonging to a certain user.
   */
  listUserDocuments(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        status: 'error',
        message: 'ID must be a number'
      });
    }
    return Document.findAll({
      where: { userId: req.params.id },
      include: [{
        model: User,
        attributes: ['id', 'username'] }],
    })
    .then((document) => {
      if (res.locals.decoded.userId === document[0].userId ||
        res.locals.decoded.userRoleId === 1) {
        return res.status(200).json({
          count: document.length,
          document,
        });
      }
      return res.status(403).send({
        message: 'Access denied'
      });
    })
    .catch(error => res.status(403).send(error));
  }
};

export default UserControllers;

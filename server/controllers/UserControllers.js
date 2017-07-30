import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pagination from '../helper/pagination';

dotenv.config();

const User = require('../models/').User;
const Document = require('../models/').Document;
// const Role = require('../models/role');


const secret = process.env.SECRET;

const UserControllers = {
  /**
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   */
  createUser(req, res) {
    if (req.body.RoleId === '1') {
      return res.status(401).send({
        message: 'Invalid roleId'
      });
    }
    const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    return User
    .create({
      fullname: req.body.fullname,
      username: req.body.username,
      password,
      email: req.body.email,
      RoleId: req.body.RoleId,
    })
    .then((user) => {
      const token = jwt.sign({
        UserId: user.id,
        userFullname: user.fullname,
        userUsername: user.username,
        userEmail: user.email,
        userRoleId: user.RoleId,
      }, secret, {
        expiresIn: '72h'
      });
      res.status(201).send({
        message: 'User successfully created',
        success: true,
        user,
        token,
      });
    })
    .catch(error => res.status(400).send(error));
  },
/**
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object containing the user's login details
   */
  login(req, res) {
    return User
      .findOne({
        where: {
          username: req.body.username
        }
      }).then((user) => {
        if (!user) {
          res.status(400).send({ message: 'User not found' });
        }
        const passkey = bcrypt.compareSync(req.body.password, user.password);
        if (passkey) {
          const token = jwt.sign({
            UserId: user.id,
            userFullname: user.fullname,
            userUsername: user.username,
            userEmail: user.email,
            userRoleId: user.RoleId,
          }, secret, {
            expiresIn: '24h'
          });
          res.status(200).send({
            status: 'ok',
            success: true,
            message: 'Token generated. Login Successful',
            UserId: user.id,
            token,
          });
        } else {
          res.status(400).send({ message: 'Incorrect password' });
        }
      })
      .catch(error => res.send(error));
  },
  listUsers(req, res) {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    return User.findAndCount({
      limit,
      offset,
      attributes: ['id', 'fullname', 'username', 'email', 'RoleId'],
    })
    .then(user => res.status(200).send({
      pagination: {
        row: user.rows,
        paginationDetails: pagination(user.count, limit, offset)
      }
    }))
    .catch(error => res.status(403).send(error));
  },


  /**
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object containing the list of user registered
   */
  searchUsers(req, res) {
    let searchKey = '%%';
    if (req.query.q) searchKey = `%${req.query.q}%`;
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
          role: user.RoleId,
          created_at: user.createdAt
        }))
    }))
    .catch(error => res.status(400).send(error));
  },

  /**
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   */
  getUser(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        status: 'error',
        message: 'id must be a number'
      });
    }
    return User
    .findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: 'error',
          message: 'User Not Found',
        });
      }
      req.user = user;
      res.status(200).send(user);
    })
    .catch(error => res.status(400).send(error));
  },

  /**
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   */
  updateUser(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        status: 'error',
        message: 'Id must be a number'
      });
    }
    return User
    .findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }
      return user
        .update({
          fullname: req.body.fullname || user.fullname,
          username: req.body.username || user.username,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)) || user.password,
        })
        .then(() => res.status(200).send({
          status: 'Successfully updated',
          user,
        }))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
  },

  /**
   *
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object showing a user has been deleted
   */
  destroy(req, res) {
    return User
    .findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(400).send({
          message: 'User Not Found',
        });
      }
      return user
        .destroy()
        .then(() => res.status(200).send({
          status: 'ok',
          message: 'You have successfully deleted a user'
        }))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
  },

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} returns a response object
   * containing the list documents belonging to a certain user.
   */
  listUserDocuments(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        status: 'error',
        message: 'ID must be a number'
      });
    }
    return Document.findAll({
      where: { UserId: req.params.id },
      include: [{
        model: User,
        attributes: ['id', 'username'] }],
    })
    .then((document) => {
      if (res.locals.decoded.UserId === document[0].UserId ||
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

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const User = require('../models/').User;
const Document = require('../models/').Document;


const secret = process.env.SECRET;

const UserControllers = {
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
      return res.status(201).send({
        message: 'User successfully created',
        success: true,
        user,
        token,
      });
    })
    .catch(error => res.status(400).send(error));
  },

  login(req, res) {
    return User
      .findOne({
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
            UserId: user.id,
            userFullname: user.fullname,
            userUsername: user.username,
            userEmail: user.email,
            userRoleId: user.RoleId,
          }, secret, {
            expiresIn: '24h'
          });
          return res.status(200).send({
            status: 'ok',
            success: true,
            message: 'Token generated. Login Successful',
            UserId: user.id,
            token,
          });
        }
        return res.status(400).send({ message: 'Incorrect password' });
      })
      .catch(error => res.send(error.message));
  },

  listUsers(req, res) {
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
      return res.status(200).send(user);
    })
    .catch(error => res.status(400).send(error));
  },

  updateUser(req, res) {
    if (isNaN(req.params.id)) {
      return res.status(400).send({
        message: 'Id must be a number'
      });
    }
    return User
    .findById(req.params.id)
    .then((user) => {
      if (user.id !== Number(req.params.id)) {
        return res.status(400).send({
          message: 'Access denied',
        });
      }
      User.findAll({
        where: {
          $or: [{
            email: req.body.email
          }, {
            username: req.body.username
          }]
        }
      })
        .then((AuthenticatedUser) => {
          if (AuthenticatedUser.length !== 0
            && (AuthenticatedUser[0].dataValues.id !== parseInt(req.params.id, 10))) {
            return res.status(400).send({
              message: 'A user exist with same email or username'
            });
          }
          return user
        .update({
          fullname: req.body.fullname || user.fullname,
          username: req.body.username || user.username,
          email: req.body.email || user.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)) || user.password,
        })
        .then(() => res.status(200).send({
          status: 'Successfully updated',
          user,
        }))
        .catch(error => res.status(400).send(error));
        })
    .catch(error => res.status(400).send(error));
    }
    );
  },

  getUserDocuments(req, res) {
    if (isNaN(parseInt(req.params.id, 10))) {
      return res.status(400).send({
        message: 'Param must be a number'
      });
    }

    User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found'
        });
      }

      Document.findAll({
        where: {
          UserId: req.params.id,
          RoleId: res.locals.decoded.userRoleId
        }
      })
        .then((documents) => {
          if (documents.length === 0) {
            return res.status(404).send({
              status: 'ok',
              message: 'No document found for this user'
            });
          }
          return res.status(200).send(documents);
        })
        .catch(() => res.status(400).send({
          message: 'error 1'
        }));
    })
    .catch(() => res.status(400).send({
      message: 'error 2'
    }));
  },

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
};

export default UserControllers;

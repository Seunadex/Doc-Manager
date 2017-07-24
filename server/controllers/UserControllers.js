import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import models from '../models';

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
      res.status(201).send({
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

  // listUsers(req, res) {
  //   Roles.findById(req.decoded.RoleId)
  //     .then(() => {
  //       if (req.decoded.RoleId === 1) {
  //         return User
  //           .findAll({
  //             attributes: ['id', 'email', 'username', 'RoleId', 'createdAt'],
  //           })
  //           .then(user => res.status(200).send(user))
  //           .catch(() => res.status(400).send({ message: 'Connection Error' }));
  //       } else if (req.decoded.userRoleId === 2) {
  //         return res.status(400).send({
  //           message: 'You do not have enough access'
  //         });
  //       }
  //       return res.status(400).send({
  //         message: 'Access Denied'
  //       });
  //     });
  // },

  listUsers(req, res) {
    return User
    .all()
    .then(user => res.status(200).send({
      status: 'OK',
      count: user.length,
      user,
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
      res.status(200).send(user);
    })
    .catch(error => res.status(400).send(error));
  },

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

  getUserDocuments(req, res) {
    // return models.Document.findAll({
    //   where: { UserId: res.locals.user.id },
    //   include: [{
    //     model: models.User,
    //     attributes: ['userUsername', 'userRoleId'] }],
    // })
    // .then((documents) => {
    //   res.status(200).send(documents);
    // })
    // .catch(error => res.status(400).send(error));
    if (isNaN(parseInt(req.params.id, 10))) {
      return res.status(400).send({
        status: 'error',
        message: 'Param must be a number'
      });
    }

    User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          status: 'error',
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
          return res.status(200).json(documents);
        })
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
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

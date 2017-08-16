import { expect } from 'chai';
import models from '../../../build/models';
import { passwordHash } from '../../helper/helper';

const User = models.User;
const newUser = {
  fullName: 'john doe',
  username: 'johndoe',
  password: passwordHash('johndoe'),
  email: 'johndoe@gmail.com'
};

const invalidUser = {
  fullName: '',
  username: '',
  password: '',
  email: 'janedoe@gmail.com'
};

describe('User model tests', () => {
  describe('Create User', () => {
    it('should create a user', (done) => {
      User.create(newUser)
      .then((user) => {
        expect(user.dataValues.fullName).to.equal(newUser.fullName);
        expect(user.dataValues.username).to.equal(newUser.username);
        expect(user.dataValues.email).to.equal(newUser.email);
        expect(user.hasPrimaryKeys).to.equal(true);
        done();
      })
      .catch();
    });
    it('should throw error if username is not specified', (done) => {
      User.create(invalidUser)
        .catch((err) => {
          expect(err.name).to.equal('SequelizeValidationError');
        });
      done();
    });

    it('should return error if user already exist', (done) => {
      User.create(newUser)
      .then()
      .catch((err) => {
        expect(err.errors[0].message).to.equal('Username already exist');
        expect(err.errors[0].type).to.equal('unique violation');
        done();
      })
      .catch();
    });

    it('should throw error if email is used', (done) => {
      User.create({
        fullName: 'jane doe',
        username: 'janedoe',
        password: passwordHash('janedoe'),
        email: 'johndoe@gmail.com'
      })
      .then()
      .catch((err) => {
        expect(err.errors[0].message).to.equal('Email already used');
        expect(err.errors[0].type).to.equal('unique violation');
        done();
      })
      .catch();
    });
  });

  describe('Update User', () => {
    it('should update a user by id', (done) => {
      User.findById('2')
        .then((user) => {
          user.update({ fullName: 'Ademola' })
            .then((userUpdate) => {
              expect(userUpdate.dataValues.fullName).to.equal('Ademola');
              done();
            });
        });
    });
  });
});


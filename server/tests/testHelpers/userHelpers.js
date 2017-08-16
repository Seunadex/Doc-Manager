import { passwordHash } from '../../helper/helper';

export default {
  validAdmin: {
    fullName: 'seun adekunle',
    username: 'seunadex',
    password: passwordHash('seunadex'),
    email: 'seunadex@gmail.com',
    roleId: 1
  },

  incompleteData: {
    fullName: '',
    username: '',
    password: '',
    email: 'seun@gmail.com'
  },

  validUser: {
    fullName: 'lionel messi',
    username: 'lionelmessi',
    password: passwordHash('lionelmessi'),
    email: 'lionelmessi@gmail.com',
    id: 2
  },

  userOne: {
    fullName: 'cristiano ronaldo',
    username: 'cr7',
    password: passwordHash('ronaldo'),
    email: 'cr7@gmail.com',
    roleId: 1
  },

  userTwo: {
    fullName: 'kun aguero',
    username: 'sergioaguero',
    password: passwordHash('aguero'),
    email: 'kunaguero@gmail.com',
    roleId: 2
  },

  userThree: {
    fullName: 'jesse lingard',
    username: 'jesse14',
    password: passwordHash('jesselingard'),
    email: 'jesse14@gmail.com',
    roleId: 2
  }

};

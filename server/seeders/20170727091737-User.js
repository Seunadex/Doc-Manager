const bcrypt = require('bcryptjs');

module.exports = {
  up: queryInterface =>
  queryInterface.bulkInsert('Users', [{
    username: 'admin',
    fullname: 'Administrator',
    email: 'admin@admin.com',
    password: bcrypt.hashSync('admin', bcrypt.genSaltSync(10)),
    roleId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    username: 'seunadex',
    fullname: 'Seun Adekunle',
    email: 'seunadekunle@gmail.com',
    password: bcrypt.hashSync('seunadekunle', bcrypt.genSaltSync(10)),
    roleId: '2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: 'maxpayne',
    fullname: 'max payne',
    email: 'maxpayne@gmail.com',
    password: bcrypt.hashSync('maxpayne', bcrypt.genSaltSync(10)),
    roleId: '2',
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    username: 'cr7',
    fullname: 'cristiano ronaldo',
    email: 'cr7@gmail.com',
    password: bcrypt.hashSync('ronaldo', bcrypt.genSaltSync(10)),
    roleId: '2',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface =>
  queryInterface.bulkDelete('Users', null, {})
};

const bcrypt = require('bcrypt');

module.exports = {
  up: queryInterface =>
  queryInterface.bulkInsert('Users', [{
    username: 'admin',
    fullname: 'Administrator',
    email: 'admin@admin.com',
    password: bcrypt.hashSync('admin', bcrypt.genSaltSync(10)),
    RoleId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }, {
    username: 'seunadex',
    fullname: 'Seun Adekunle',
    email: 'seunadekunle@gmail.com',
    password: bcrypt.hashSync('seunadekunle', bcrypt.genSaltSync(10)),
    RoleId: '2',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {}),

  down: queryInterface =>
  queryInterface.bulkDelete('Users', null, {})
};

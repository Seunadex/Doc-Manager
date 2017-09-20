module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('Documents', [{
      title: 'Welcome',
      content: `Hello and welcome, if this is the first time running the app,
you can login with the following default admin settings:
username: admin
password: admin
Please login and change the default root password.`,
      userId: 1,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: 1
    }, {
      title: 'A Song of Ice and Fire III',
      content: 'The day was a pack of hounds deep in the haunted forest.',
      userId: 2,
      access: 'private',
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: 2
    }, {
      title: 'Another doc',
      content: 'Chett felt it too in the haunted forest.',
      userId: 2,
      access: 'public',
      createdAt: new Date(),
      updatedAt: new Date(),
      roleId: 2
    }], {}),
  down: queryInterface =>
  queryInterface.bulkDelete('Documents', null, {})
};

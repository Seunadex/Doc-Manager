module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Role already exist' }
    },
  });
  Role.associate = (models) => {
    Role.belongsTo(models.User, {
      foreignKey: 'RoleId',
      as: 'users'
    });
  };
  return Role;
};

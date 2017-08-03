module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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

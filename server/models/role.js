module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          message: 'Role cannot be empty'
        }
      }
    },
  }, {
    classMethods: {
      associate: (models) => {
        Role.hasMany(models.User, {
          foreignkey: 'RoleId',
        });
      }
    }
  });
  return Role;
};

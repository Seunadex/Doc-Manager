// /* eslint no-underscore-dangle: 0 no-lone-blocks: 0*/

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username already exist'
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email already used'
      }
    },
    RoleId: {
      type: DataTypes.STRING,
      defaultValue: 2,
    }
  });
  User.associate = (models) => {
    User.hasMany(models.Document, {
      foreignKey: 'UserId',
      as: 'documents'
    });
    User.belongsTo(models.Role, {
      foreignKey: 'RoleId',
      onDelete: 'CASCADE'
    });
  };
  return User;
};

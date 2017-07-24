module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          message: 'Name field cannot be empty'
        },
        is: /^[a-z]+$/i
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          message: 'Username cannot be empty'
        }
      }
    },
    password: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isEmpty: {
          message: 'Please enter your password'
        },
        len: [6, 12]
      }
    },
    phoneNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: {
          message: 'Only numbers are allowed'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          message: 'Invalid email address',
        }
      }
    },
    RoleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          message: 'Id must be an integer'
        }
      }
    }
  });
  User.associate = (models) => {
    User.hasMany(models.Document, {
      foreignKey: 'UserId',
      as: 'document'
    });
    User.belongsTo(models.Role, {
      foreignKey: 'RoleId',
      onDelete: 'CASCADE'
    });
  };
  return User;
};

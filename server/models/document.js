module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          message: 'Please enter document title'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          message: 'Content field cannot be empty!'
        }
      }
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'public',
      validate: {
        validate: {
          isIn: {
            args: [['public', 'private', 'role']],
            message: 'Must either be public, private or role'
          }
        }
      }
    },
    RoleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          message: 'Id must be an integer!'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          message: 'UserId must be an integer!'
        }
      }
    }
  });
  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      foreignKey: 'UserId',
      onDelete: 'CASCADE'
    });
  };
  return Document;
};

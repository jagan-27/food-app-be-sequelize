const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    userMobileNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      field: 'User_Mobile_Number'
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'User_Name'
    },
    userType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'User_Type'
    },
    userPassword: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'User_Password'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    tableName: 'User',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "User_pkey",
        unique: true,
        fields: [
          { name: "User_Mobile_Number" },
        ]
      },
    ]
  });
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userMobileNumber: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      field: 'User_Mobile_Number', // Maps to snake_case in the DB
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'User_Name', // Maps to snake_case in the DB
    },
    userType: {
      type: DataTypes.STRING,
      field: 'User_Type', // Maps to snake_case in the DB
    },
    userPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'User_Password', // Maps to snake_case in the DB
    },
  }, {
    tableName: 'User_Table', // Define table name explicitly
    timestamps: false, // Disable automatic timestamps
  });

  return User;
};

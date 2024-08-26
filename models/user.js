module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      User_Mobile_Number: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      User_Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      User_Type: {
        type: DataTypes.STRING,
      },
      User_Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'User_Table',
      timestamps: false,
    });
  
    return User;
  };
  
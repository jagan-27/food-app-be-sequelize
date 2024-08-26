module.exports = (sequelize, DataTypes) => {
    const Hotel = sequelize.define('Hotel', {
      User_Mobile_Number: {
        type: DataTypes.BIGINT,
        references: {
          model: 'User_Table',
          key: 'User_Mobile_Number'
        }
      },
      Hotel_ID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      Hotel_Name: {
        type: DataTypes.STRING,
      },
      Hotel_Address: {
        type: DataTypes.STRING,
      },
      Hotel_City: {
        type: DataTypes.STRING,
      },
      Hotel_Rating: {
        type: DataTypes.STRING,
      },
      Hotel_Phone: {
        type: DataTypes.BIGINT,
      },
      Hotel_Map_Location_Link: {
        type: DataTypes.STRING,
      },
      Hotel_Vlog_Video_Link: {
        type: DataTypes.STRING,
      },
      Vlog_Video_View_Count: {
        type: DataTypes.STRING,
      },
      Vlog_Post_Date: {
        type: DataTypes.DATE,
      },
      created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      modified_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: 'Hotel_Table',
      timestamps: false,
    });
  
    return Hotel;
  };
  
module.exports = (sequelize, DataTypes) => {
  const Hotel = sequelize.define('Hotel', {
    userMobileNumber: {
      type: DataTypes.BIGINT,
      references: {
        model: 'User_Table',
        key: 'User_Mobile_Number'
      },
      field: 'User_Mobile_Number', // This keeps the snake_case column name in DB
    },
    hotelId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'Hotel_ID', // Map to snake_case column name in DB
    },
    hotelName: {
      type: DataTypes.STRING,
      field: 'Hotel_Name', // Map to snake_case column name in DB
    },
    hotelAddress: {
      type: DataTypes.STRING,
      field: 'Hotel_Address', // Map to snake_case column name in DB
    },
    hotelCity: {
      type: DataTypes.STRING,
      field: 'Hotel_City', // Map to snake_case column name in DB
    },
    hotelRating: {
      type: DataTypes.STRING,
      field: 'Hotel_Rating', // Map to snake_case column name in DB
    },
    hotelPhone: {
      type: DataTypes.BIGINT,
      field: 'Hotel_Phone', // Map to snake_case column name in DB
    },
    hotelMapLocationLink: {
      type: DataTypes.STRING,
      field: 'Hotel_Map_Location_Link', // Map to snake_case column name in DB
    },
    hotelVlogVideoLink: {
      type: DataTypes.STRING,
      field: 'Hotel_Vlog_Video_Link', // Map to snake_case column name in DB
    },
    vlogVideoViewCount: {
      type: DataTypes.STRING,
      field: 'Vlog_Video_View_Count', // Map to snake_case column name in DB
    },
    vlogPostDate: {
      type: DataTypes.DATE,
      field: 'Vlog_Post_Date', // Map to snake_case column name in DB
    },
    createdDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_date', // Map to snake_case column name in DB
    },
    modifiedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'modified_date', // Map to snake_case column name in DB
    },
  }, {
    tableName: 'Hotel_Table', // Define the table name
    timestamps: false, // Disable the default `createdAt` and `updatedAt` fields
  });

  return Hotel;
};

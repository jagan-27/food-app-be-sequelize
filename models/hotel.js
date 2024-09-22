const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hotel', {
    userMobileNumber: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'User',
        key: 'User_Mobile_Number'
      },
      field: 'User_Mobile_Number'
    },
    hotelId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'Hotel_ID'
    },
    hotelName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'Hotel_Name'
    },
    hotelAddress: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Hotel_Address'
    },
    hotelCity: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Hotel_City'
    },
    hotelRating: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Hotel_Rating'
    },
    hotelPhone: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'Hotel_Phone'
    },
    hotelMapLocationLink: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Hotel_Map_Location_Link'
    },
    hotelVlogVideoLink: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Hotel_Vlog_Video_Link'
    },
    vlogVideoViewCount: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Vlog_Video_View_Count'
    },
    vlogPostDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'Vlog_Post_Date'
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'is_active'
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_date'
    },
    modifiedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'modified_date'
    },
    valid: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    latitude: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    videoId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'video_id'
    },
    videoType: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'video_type'
    },
    hotelCategory: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'hotel_category'
    }
  }, {
    sequelize,
    tableName: 'Hotel',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Hotel_pkey",
        unique: true,
        fields: [
          { name: "Hotel_ID" },
        ]
      },
    ]
  });
};

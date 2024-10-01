const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hotelVideo', {
    hotelVideoId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'hotel_video_id'
    },
    hotelId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Hotel',
        key: 'Hotel_ID'
      },
      field: 'Hotel_ID'
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
    videoid: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    videotype: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    userMobileNumber: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'user_mobile_number'
    }
  }, {
    sequelize,
    tableName: 'Hotel_Video',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Hotel_Video_pkey",
        unique: true,
        fields: [
          { name: "hotel_video_id" },
        ]
      },
    ]
  });
};

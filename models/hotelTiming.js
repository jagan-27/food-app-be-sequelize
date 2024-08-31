const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hotelTiming', {
    hotelTimingTableId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'hotel_timing_table_id'
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
    morning: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Morning'
    },
    noon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Noon'
    },
    evening: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Evening'
    },
    lateNight: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'LateNight'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    tableName: 'Hotel_Timing',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Hotel_Timing_pkey",
        unique: true,
        fields: [
          { name: "hotel_timing_table_id" },
        ]
      },
    ]
  });
};

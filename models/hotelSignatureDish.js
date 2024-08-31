const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('hotelSignatureDish', {
    hotelSignatureDishId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'hotel_signature_dish_id'
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
    dishName: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: 'Dish_Name'
    },
    dishPrice: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Dish_Price'
    },
    dishCategory: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'Dish_Category'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    tableName: 'Hotel_Signature_Dish',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "Hotel_Signature_Dish_pkey",
        unique: true,
        fields: [
          { name: "hotel_signature_dish_id" },
        ]
      },
    ]
  });
};

var DataTypes = require("sequelize").DataTypes;
var _hotel = require("./hotel");
var _hotelSignatureDish = require("./hotelSignatureDish");
var _hotelTiming = require("./hotelTiming");
var _user = require("./user");

function initModels(sequelize) {
  var hotel = _hotel(sequelize, DataTypes);
  var hotelSignatureDish = _hotelSignatureDish(sequelize, DataTypes);
  var hotelTiming = _hotelTiming(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  hotelSignatureDish.belongsTo(hotel, { as: "hotel", foreignKey: "hotelId"});
  hotel.hasMany(hotelSignatureDish, { as: "hotelSignatureDishes", foreignKey: "hotelId"});
  hotelTiming.belongsTo(hotel, { as: "hotel", foreignKey: "hotelId"});
  hotel.hasMany(hotelTiming, { as: "hotelTimings", foreignKey: "hotelId"});
  hotel.belongsTo(user, { as: "userMobileNumberUser", foreignKey: "userMobileNumber"});
  user.hasMany(hotel, { as: "hotels", foreignKey: "userMobileNumber"});

  return {
    hotel,
    hotelSignatureDish,
    hotelTiming,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

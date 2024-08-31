var DataTypes = require("sequelize").DataTypes;
var _hotelTable = require("./hotelTable");
var _userTable = require("./userTable");

function initModels(sequelize) {
  var hotelTable = _hotelTable(sequelize, DataTypes);
  var userTable = _userTable(sequelize, DataTypes);

  hotelTable.belongsTo(userTable, { as: "userMobileNumberUserTable", foreignKey: "userMobileNumber"});
  userTable.hasMany(hotelTable, { as: "hotelTables", foreignKey: "userMobileNumber"});

  return {
    hotelTable,
    userTable,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    status: DataTypes.INTEGER,
    orderNumber: DataTypes.STRING,
    UserId:DataTypes.INTEGER
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
    Order.hasMany(models.OrderedProduct);
    Order.belongsTo(models.User);
  };
  return Order;
};
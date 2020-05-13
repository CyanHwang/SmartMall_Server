'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    number: DataTypes.INTEGER,
    ProductId:DataTypes.INTEGER,
    UserId:DataTypes.INTEGER
  }, {});
  Cart.associate = function(models) {
    // associations can be defined here
    Cart.belongsTo(models.Product);
    Cart.belongsTo(models.User);
  };
  return Cart;
};
'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderedProduct = sequelize.define('OrderedProduct', {
    productId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    number: DataTypes.INTEGER,
    ProductId:DataTypes.INTEGER,
    OrderId:DataTypes.INTEGER
  }, {});
  OrderedProduct.associate = function(models) {
    // associations can be defined here
    OrderedProduct.belongsTo(models.Product);
    OrderedProduct.belongsTo(models.Order);
  };
  return OrderedProduct;
};
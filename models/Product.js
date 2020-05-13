'use strict';
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        name: DataTypes.STRING,
        image: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        sale: DataTypes.BOOLEAN,
        stock: DataTypes.INTEGER,
        excellent: DataTypes.BOOLEAN,
        body: DataTypes.TEXT,
        code: DataTypes.STRING,
        CategoryId:DataTypes.INTEGER
    }, {});
    Product.associate = function (models) {
        // associations can be defined here
        Product.belongsTo(models.Category);
    };
    return Product;
};
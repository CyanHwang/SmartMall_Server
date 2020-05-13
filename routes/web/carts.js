module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const models = require("../../models");

  // 购物车首页,查出购物车商品和购物袋信息
  router.get("/", async (req, res) => {
    const data = models.Cart.findAll({
      include: [models.Product],
      where: { userId: req.decoded.user.id },
    });
    let total_price = 0;
    let number = 0;
    data.map((item) => {
      total_price += item.number * item.Product.price;
      number += item.number;
    });

    res.json({
      success: true,
      message: "查询成功",
      data: data,
      total: total_price,
      number: number,
    });
  });

  // 扫码加入购物车，前端传code过来
  router.post("/", async (req, res) => {
    const code = req.body.code;
    let product = models.Product.findOne({
      where: {
        code: code,
      },
    });
    if (!product) {
      res.json({ success: false, message: "此商品不存在！" });
      return;
    }
    let cart =await models.Cart.findOrCreate({
      where: {
        ProductId: product.id,
        UserId: req.decoded.user.id,
      },
      defaults: {
        number: 1,
        UserId: req.decoded.user.id,
        ProductId: product.id,
      },
    }).spread((cart, created) => {
      if (!created) {
        models.Cart.findOne({ where: { ProductId: product.id } })
          .then((cart) => {
            return cart.increment("number");
          })
          .then((cart) => {
            res.json({ success: true, message: "添加成功" });
          });
      }
      res.json({ success: true, message: "添加成功", data: cart });
    });
  });

  // 数量加减
  router.put("/", async (req, res)=> {
    let type = req.body.type;
    let cart_id = req.body.cart_id;

    models.Cart.findByPk(cart_id).then((cart) => {
      if (type === "inc") {
        cart.increment("number");
        return res.json({ success: true, message: "修改成功" });
      }

      if (cart.number > 1) {
        cart.decrement("number");
        return res.json({ success: true, message: "修改成功" });
      }

      cart.destroy();
      res.json({ success: true, message: "删除成功" });
    });
  });

  // 清空购物车
  router.delete("/", function (req, res, next) {
    models.Cart.destroy({
      include: [models.User],
      where: { userId: req.decoded.user.id },
    }).then(() => {
      res.json({ success: true, message: "清空成功" });
    });
  });

  app.use("/user/carts", router);
};

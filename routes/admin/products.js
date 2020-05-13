module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const models = require("../../models");
  const sequelize = require("sequelize");
  const Op = sequelize.Op;

  router.get("/", async (req, res, next) => {
    const currentPage =
      req.param("currentPage") == undefined ? 1 : req.param("currentPage"); //判断当前是第几页
    const pageSize =
      req.param("pageSize") == undefined ? 3 : req.param("pageSize"); //每页显示几条

    //按商品名称模糊搜索
    const keyword = req.query.keyword;
    //按分类搜索
    const CategoryId = req.query.CategoryId;
    let data = {};
    if (keyword != undefined && keyword != "") {
      data.name = {
        [Op.like]: "%" + keyword + "%",
      };
    }

    if (CategoryId != undefined && CategoryId != "") {
      data.CategoryId = {
        [Op.eq]: CategoryId,
      };
    }

    const product = await models.Product.findAndCountAll({
      include: [{model:models.Category,attributes:['name']}],
      where: data,
      order: [["id", "DESC"]],
      offset: (currentPage - 1) * pageSize, //每页显示的数据
      limit: parseInt(pageSize), //传入页数
    });
    res.json({
      products: product.rows,
      // 分页显示输出
      pagination: {
        current: parseInt(currentPage),
        pageSize: parseInt(pageSize),
        total: product.count,
      },
    });
  });

  //查询单条
  router.get("/:id", async (req, res) => {
    const data = await models.Product.findByPk(req.params.id);
    res.json(data);
  });

  // 新增商品
  router.post("/", async (req, res, next) => {
    const reg = /[0-9]+/;
    if (!req.body.name || req.body.name == "") {
      return res.json({ success: false, msg: "请填写名称~" });
    }
    if (!req.body.price || req.body.price == "") {
      return res.json({ success: false, msg: "请填写单价~" });
    }

    const data = await models.Product.create(req.body);
    res.json(data);
  });

  // 编辑商品
  router.put("/:id", async (req, res) => {
    const data = await models.Product.findByPk(req.params.id);
    product.update(req.body);
    res.json(data);
  });

  
  // 删除单个
  router.delete("/:id", async (req, res) => {
    await models.Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ success: true });
  });

  // 批量删除
  router.post("/delete_checked", async (req, res) => {
    await models.Product.destroy({
      where: {
        id: {
          [Op.in]: req.body.checked_id,
        },
      },
    });
    res.json({ success: true });
  });

  app.use("/admin/products", router);
};

module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const models = require("../../models");
  const Decimal = require("decimal.js");

  // 所有分类
  router.get("/", async (req, res)=> {
   const data = await models.Category.findAll({ order: [["id", "DESC"]] })
      res.json(data);
  });

  // 查询单条
  router.get("/:id", async (req, res)=> {
    let id = req.params.id;
    const data = await models.Category.findByPk(id)
      res.json(data);
  });

  // 新增分类
  router.post("/", async (req, res)=> {
    const reg = /[0-9]+/;
    if (!req.body.name || req.body.name == "") {
      return res.json({ success: false, msg: "请填写名称~" });
    }
    if (!reg.test(req.body.sort) && new Decimal(req.body.sort)) {
      return res.json({ success: false, msg: "排序值必须是整数~" });
    }

    const data = await models.Category.create(req.body)
      res.json(data);
  });

  // 编辑分类
  router.put("/:id", async (req, res) =>{
    const data = await models.Category.findByPk(req.params.id)
      data.update(req.body);
      res.json(data);
  });

  // 删除分类
  router.delete("/:id", async (req, res)=> {
    const data = await models.Category.findByPk(req.params.id)
      data.destroy();
      res.json(data);
  });

  // 排序
  router.put("/", async (req, res)=> {
    const data = await models.Category.findByPk(req.body.id)
      data.update({
        sort: req.body.sort,
      });
      res.json(data);
  });

  app.use("/admin/categories", router);
};

module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const models = require("../../models");
  const jwt = require("jsonwebtoken");

  const bcrypt = require("bcryptjs");

  //登录接口
  router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      res.json({ success: false, message: "用户名或密码错误！" });
      return;
    }

    const data = await models.User.findOne({
      where: {
        username: username,
      },
    });
    if (!data) {
      res.json({ success: false, message: "用户名不存在！" });
      return;
    }

    if (!bcrypt.compareSync(password, data.password)) {
      res.json({ success: false, message: "密码错误！" });
      return;
    }

    const token = jwt.sign(
      {
        user: {
          id: data.id,
          username: username,
          admin: true,
        },
      },
      process.env.SECRET,
      { expiresIn: 60 * 60 * 24 * 7 }
    );

    res.json({
      success: true,
      message: "请求成功",
      token: token,
    });
  });

  router.post("/register", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const check_password = req.body.check_password;

    if (!req.body.username || !req.body.password) {
      res.json({ success: false, message: "用户名或密码必填！" });
      return;
    }

    if (check_password != password) {
      res.json({ success: false, message: "两次密码输入不一致！" });
      return;
    }

    let data = await models.User.findOne({
      where: {
        username: username,
      },
    });
    if (data) {
      res.json({ success: false, message: "用户名已注册！" });
      return;
    }
    password = bcrypt.hashSync(password, 8);
    let user = await models.User.create({
      username: username,
      password: password,
    });
    res.json({
      success: true,
      message: "请求成功",
      user: user,
    });
  });

  app.use("/admin/users", router);
};

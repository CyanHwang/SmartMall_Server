module.exports = (app) => {
  const express = require("express");
  const router = express.Router();
  const request = require("request");
  const jwt = require("jsonwebtoken");
  const models = require("../../models");

  //小程序登录接口
  router.post("/login", (req, res)=> {
    const code = req.body.code;
    request.get(
      {
        uri: "https://api.weixin.qq.com/sns/jscode2session",
        json: true,
        qs: {
          grant_type: "authorization_code",
          appid: "wx4a9965771e11b4bd",
          secret: "e94f1c12cb09e31bff0f12826f945b60",
          js_code: code,
        },
      },
      async (err, response, data) => {
        if (response.statusCode != 200) {
          return res.json(err);
        }

        //根据openid去数据库找当前用户
        let user = await models.User.findOne({
          where: { openid: data.openid },
        });
        //如果用户不存在，插入用户信息
        if (!user) {
          user = await models.User.create({ openid: data.openid, admin: 0 });
        }

        //如果用户存在，则生成token，返回给前端
        const token = jwt.sign(
          {
            user: {
              id: user.id,
              openid: data.openid,
              admin: false,
            },
          },
          process.env.SECRET,
          { expiresIn: 60 * 60 * 24 * 7 }
        );
        res.json({ success: true, message: "登录成功", token: token });
      }
    );
  });

  app.use("/users",router);
};

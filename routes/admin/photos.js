module.exports = (app) => {
  const express = require("express");
  const qiniu = require("qiniu");
  const router = express.Router();

  //上传图片
  router.get("/uploadToken",  (req, res, next) =>{
    const accessKey = "fAotwAkyCf3pp-v7lx9katOiZiwYE6KCHyy7fWg4";
    const secretKey = "dkCY3RGS3ZXK4KS464JZKg17826-vZPQ7zwn2dp2";
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    const options = {
      scope: "huangdj",
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    res.json({ success: true, token: uploadToken });
  });

  app.use("/admin/photos", router);
};

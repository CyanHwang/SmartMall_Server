module.exports = (app) => {
  const express = require("express");
  const qiniu = require("qiniu");
  const router = express.Router();

  //上传图片
  router.get("/uploadToken",  (req, res, next) =>{
    const accessKey = "OGxV2MvbFde6yWyz3b2Ch-FfpzZ5_b_IVvsAjYg0";
    const secretKey = "ET6uoAUuFTRwtOJ4BG5e0h_ruZbeVypZjt2r8b0J";
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

    const options = {
      scope: "cyan",
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    res.json({ success: true, token: uploadToken });
  });

  app.use("/admin/photos", router);
};

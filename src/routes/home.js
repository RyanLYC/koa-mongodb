import Router from "@koa/router";
import { upload } from "../controllers/home";

const router = new Router();

// 上传图片
router.post("/upload", upload);

module.exports = router;

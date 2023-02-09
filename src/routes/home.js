import Router from "@koa/router";
import { upload, uploadFileBlock, merge, checkFile } from "../controllers/home";

const router = new Router();

// 上传图片
router.post("/upload", upload);

// 分块上传文件
router.post("/uploadFileBlock", uploadFileBlock);
// 合并文件块
router.post("/merge", merge);
// 检测文件是否完整
router.post("/checkFile", checkFile);

module.exports = router;

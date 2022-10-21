import Router from "@koa/router";
import {
  find,
  findById,
  create,
  update,
  listFollowers,
  checkTopicExist,
} from "../controllers/topics";
import { auth } from "../utils/index";

const router = new Router({ prefix: "/topics" });

router.post("/", auth, create);

router.get("/", find);

router.get("/:id", checkTopicExist, findById);

// patch可以更新多个字段
router.patch("/:id", auth, checkTopicExist, update);

// 获取话题粉丝接口
router.get("/:id/followers", checkTopicExist, listFollowers);

module.exports = router;

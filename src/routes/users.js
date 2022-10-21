import Router from "@koa/router";
import {
  login,
  create,
  find,
  update,
  checkOwner,
  findById,
  checkUserExist,
  follow,
  unfollow,
  listFollowers,
} from "../controllers/users";
import { auth } from "../utils/index";

const router = new Router({ prefix: "/users" });

// 登录接口
router.post("/login", login);
// 创建用户
router.post("/create", create);
// 查找用户 需要验证 token
router.get("/find", auth, find);
// 查找用户 需要验证 token 需要自己才能更新自己
router.post("/update", auth, checkOwner, update);
// 查找特定用户
router.get("/findById", findById);
// 关注某人
router.put("/follow/:id", auth, checkUserExist, follow);
// 取消关注
router.delete("/follow/:id", auth, checkUserExist, unfollow);
// 获取粉丝接口
router.get("/:id/followers", listFollowers);
// 话题接口
router.get("/:id/followingTopics", listFollowingTopics);
// 关注话题接口
router.put("/followingTopics/:id", auth, checkTopicExist, followTopic);
// 取消关注话题接口
router.delete("/followingTopics/:id", auth, checkTopicExist, unfollowTopic);

module.exports = router;

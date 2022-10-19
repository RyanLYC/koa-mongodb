import Router from "@koa/router";
import { login, create, find, update, checkOwner } from "../controllers/users";
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

module.exports = router;

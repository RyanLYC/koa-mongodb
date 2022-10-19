import Router from "@koa/router";
import { login, create, find } from "../controllers/users";
import { auth } from "../utils/index";

const router = new Router({ prefix: "/users" });

// 登录接口
router.post("/login", login);
// 创建用户
router.post("/create", create);
// 查找用户 需要验证 token
router.get("/find", auth, find);

module.exports = router;

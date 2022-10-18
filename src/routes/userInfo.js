import Router from "@koa/router";
import * as controller from "../controller/userInfo";

const router = new Router({ prefix: "/userInfo" });

router.post("/save", controller.save);
router.post("/update", controller.update);
router.post("/delete", controller.del);

module.exports = router;

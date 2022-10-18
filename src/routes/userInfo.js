import Router from "@koa/router";
import { save, update, del } from "../controllers/userInfo";

const router = new Router({ prefix: "/userInfo" });

router.post("/save", save);
router.post("/update", update);
router.post("/delete", del);

module.exports = router;

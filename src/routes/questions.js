const jwt = require("koa-jwt");
const Router = require("koa-router");
const router = new Router({ prefix: "/questions" });
const {
  find,
  findById,
  create,
  update,
  delete: del,
  checkQuestioner,
  checkQuestionExist,
} = require("../controllers/questions");
import { auth } from "../utils/index";

router.get("/", find);

router.post("/", auth, create);

router.get("/:id", checkQuestionExist, findById);

// patch可以更新多个字段
router.patch("/:id", auth, checkQuestionExist, checkQuestioner, update);

router.delete("/:id", auth, checkQuestioner, del);

module.exports = router;

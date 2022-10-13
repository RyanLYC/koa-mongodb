import * as controller from "../controller/userInfo";

export function initUserInfoRoute(router) {
  router.post("/userInfo/save", controller.save);
  router.post("/userInfo/update", controller.update);
  router.post("/userInfo/delete", controller.del);
}

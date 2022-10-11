import * as controller from "../controller/test";

/** test get post */
export function initTestRoute(router) {
  /**路由中间件*/
  router.get("/test", controller.testGet);
  router.get("/test", controller.testGet2);
  router.post("/test", controller.testPost);
  //请求方式 http://域名/user/123
  router.get("/user/:id", controller.userGet);
}

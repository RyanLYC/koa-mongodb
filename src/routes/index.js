import { initTestRoute } from "./test";

export function initGlobalRoute(router) {
  initTestRoute(router);

  router.get("/", async (ctx) => {
    let title = "你好ejs";

    await ctx.render("index", {
      title: title,
    });
  });
}

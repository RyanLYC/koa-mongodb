import { initTestRoute } from "./test";

export function initGlobalRoute(router) {
  initTestRoute(router);

  router.get("/", async (ctx) => {
    let title = "ejs: Hi ";

    await ctx.render("index", {
      title: title,
    });
  });
}

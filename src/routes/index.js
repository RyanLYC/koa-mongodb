import { initTestRoute } from "./test";
import { initUserInfoRoute } from "./userInfo";

export function initGlobalRoute(router) {
  initTestRoute(router);
  initUserInfoRoute(router);

  router.get("/", async (ctx) => {
    ctx.cookies.set("userinfo", "lyc", {
      maxAge: 60 * 1000 * 60,
      // path:'/abc',  /*配置可以访问的页面*/
      // domain:'.baidu.com'  /*正常情况不要设置 默认就是当前域下面的所有页面都可以方法*/

      httpOnly: false, //true表示这个cookie只有服务器端可以访问，false表示客户端（js），服务器端都可以访问
      /*
          a.baidu.com
          b.baidu.com  共享cookie的数据
      * */
      // koa中没法直接设置中文的cookie
    });
    //  var userinfo = ctx.cookies.get('userinfo');

    let title = "ejs: Hi ";
    await ctx.render("index", {
      title: title,
    });
  });
}

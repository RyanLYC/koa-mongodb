import Koa from "koa";
import path from "path";
import Router from "@koa/router";
import { initGlobalRoute } from "./routes";
import { handleResponse } from "./middleware";
import KoaBody from "koa-body";
// 第三方中间件
const KoaStatic = require("koa-static");
const views = require("koa-views");

const app = new Koa();
const router = new Router();
// 静态资源的配置
app.use(KoaStatic(path.join(__dirname, "/static")));
app.use(KoaStatic(path.join(__dirname, "/public")));

// ejs
// app.use(views(__dirname + '/views', {map: {html: 'ejs'}})) 这种方式文件名得写.html
app.use(views(__dirname + "/views", { extension: "ejs" })); //这种写.ejs

app.use(
  KoaBody({
    multipart: true,
  })
);
/**应用级中间件 固定返回格式 */
app.use(handleResponse());

//中间件配置公共的信息
app.use(async (ctx, next) => {
  ctx.state.userName = "RyanLyc";
  await next(); /*继续向下匹配路由*/
});

initGlobalRoute(router);

/**在加了router.allowedMethods()中间件情况下，如果接口是get请求，而前端使用post请求，会返回405 Method Not Allowed ，提示方法不被允许 ，并在响应头有添加允许的请求方式；而在不加这个中间件这种情况下，则会返回 404 Not Found找不到请求地址，并且响应头没有添加允许的请求方式 。 */
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);

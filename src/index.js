import Koa from "koa";
import path from "path";
// import Router from "@koa/router";
import routing from "./routes";
import { handleResponse, log, cors } from "./middleware";
import KoaBody from "koa-body";
// 第三方中间件
const KoaStatic = require("koa-static");
const views = require("koa-views");
/** 错误处理中间件 */
import error from "koa-json-error";
/** 参数校验中间件 */
import parameter from "koa-parameter";
import globalLogger from "./utils/globalLog";
import MgDb from "./mongoose";
MgDb.getInstance().connect();

const app = new Koa();
app.use(cors);
app.use(log());

// const router = new Router();
// 静态资源的配置
app.use(KoaStatic(path.join(__dirname, "/static")));
app.use(KoaStatic(path.join(__dirname, "/public")));

// ejs
// app.use(views(__dirname + '/views', {map: {html: 'ejs'}})) 这种方式文件名得写.html
app.use(views(__dirname + "/views", { extension: "ejs" })); //这种写.ejs
// art-template高性能模板引擎

//  session 是另一种记录客户状态的机制，不同的是 Cookie 保存在客户端浏览器中，而session 保存在服务器上。
//Session 的工作流程
// 当浏览器访问服务器并发送第一次请求时，服务器端会创建一个 session 对象，生成一个类似于 key,value 的键值对， 然后将 key(cookie)返回到浏览器(客户)端，浏览器下次再访问时，携带 key(cookie)，找到对应的 session(value)。 客户的信息都保存在 session 中
// 1. yarn add koa-session -S
// 2. const session = require('koa-session');
// 3.设置官方文档提供的中间件
//配置session的中间件
// app.keys = ["some secret hurr"]; /*cookie的签名*/
// const CONFIG = {
//   key: "koa:sess", //cookie key (default is koa:sess)
//   maxAge: 86400000, // cookie 的过期时间 maxAge in ms (default is 1 days)
//   overwrite: true, //是否可以 overwrite (默认 default true)
//   httpOnly: true, //cookie 是否只有服务器端可以访问 httpOnly or not (default true)
//   signed: true, //签名默认 true
//   rolling: false, //在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）
//   renew: false, //(boolean) renew session when session is nearly expired,
// };
// app.use(session(CONFIG, app));
// 设置值 ctx.session.username = "张三";
// 获取值 ctx.session.usernam
//4.Cookie 和 Session 区别
// 1、cookie 数据存放在客户的浏览器上，session 数据放在服务器上。
// 2、cookie 不是很安全，别人可以分析存放在本地的 COOKIE 并进行 COOKIE 欺骗
// 考虑到安全应当使用 session。
// 3、session 会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能
// 考虑到减轻服务器性能方面，应当使用 COOKIE。
// 4、单个 cookie 保存的数据不能超过 4K，很多浏览器都限制一个站点最多保存 20 个 cookie

app.use(
  error({
    // Avoid showing the stacktrace in 'production' env
    postFormat: (e, obj) =>
      process.env.NODE_ENV === "production"
        ? {
            code: obj.status,
            data: obj.message,
          }
        : {
            code: obj.status,
            data: obj.message,
            stack: obj.stack,
          },
  })
); // 必须配置在路由的上面

app.use(
  KoaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, "/public/uploads"),
      keepExtensions: true,
    },
  })
);
/**应用级中间件 固定返回格式 */
app.use(handleResponse());

//中间件配置公共的信息
app.use(async (ctx, next) => {
  ctx.state.userName = "RyanLyc";
  await next(); /*继续向下匹配路由*/
});

app.use(parameter(app));
routing(app);

globalLogger();

app.listen(3000, () => console.log("程序启动在3000端口"));

const fs = require("fs");
/*
自动读取文件模块
*/
module.exports = (app) => {
  // 同步读取文件
  fs.readdirSync(__dirname).forEach((file) => {
    if (file === "index.js") {
      return;
    }

    const route = require(`./${file}`);
    /**在加了router.allowedMethods()中间件情况下，如果接口是get请求，而前端使用post请求，会返回405 Method Not Allowed ，提示方法不被允许 ，并在响应头有添加允许的请求方式；而在不加这个中间件这种情况下，则会返回 404 Not Found找不到请求地址，并且响应头没有添加允许的请求方式 。 */
    // 注册路由 响应options
    app.use(route.routes()).use(route.allowedMethods());
  });
};

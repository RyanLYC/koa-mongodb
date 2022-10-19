import { RESPONSE_CODE } from "../constant";
import jsonwebtoken from "jsonwebtoken";
import config from "../config";
import User from "../models/users";

class UserCtl {
  /**创建用户 */
  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      password: { type: "string", required: true },
    });
    /*
    判断用户名是否重复
    */
    //1.先从数据库中查询用户名是否重复
    const { name } = ctx.request.body;
    const repeatedUser = await User.findOne({ name });
    // 2.如果重复则抛出异常
    if (repeatedUser) {
      ctx.throw(409, "用户名已经存在");
    }

    const user = await new User(ctx.request.body).save();
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: user,
    };
  }
  /**登录 */
  async login(ctx) {
    ctx.verifyParams({
      name: { type: "string", require: true },
      password: { type: "string", require: true },
    });
    // 请求数据库获取用户名密码
    const user = await User.findOne(ctx.request.body);
    if (!user) {
      ctx.throw(401, "用户名或密码不正确");
    }
    const { _id, name } = user;
    /*
    使用数字签名实现token
    secret:密码
    expiresIn:过期时间
    */
    const token = jsonwebtoken.sign({ _id, name }, config.secret, {
      expiresIn: "10d",
    });
    // 返回给客户端
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: { token },
    };
  }

  /**查询所有用户 */
  async find(ctx) {
    const { pageSize = 10 } = ctx.query;
    const pageNo = Math.max(ctx.query.pageNo * 1) - 1;
    // 接收每页有多少项 ，如果是 0 或者 -1 则使用Math函数来修正为 1
    const perPage = Math.max(pageSize * 1, 1);
    /*
        limit(10):只返回10项
        skip(10):跳过10项

        合起来：返回第二页
        */
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: await User
        // 实现话题的模糊搜索
        .find({ name: new RegExp(ctx.query.q) })
        .limit(perPage)
        .skip(pageNo * perPage),
    };
  }
}

module.exports = new UserCtl();

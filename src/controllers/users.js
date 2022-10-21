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
      data: { token, id: _id },
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

  /**判断是否有权限的中间件 */
  async checkOwner(ctx, next) {
    if (ctx.request.body.id !== ctx.state.user._id) {
      ctx.throw(403, "没有权限操作");
    }
    await next();
  }

  /**修改用户 */
  async update(ctx) {
    ctx.verifyParams({
      id: { type: "string", required: true },
      name: { type: "string", required: false },
      password: { type: "string", required: false },
      avatar_url: { type: "string", required: false },
      gender: { type: "string", required: false },
      headline: { type: "string", required: false },
      locations: { type: "array", itemType: "string", required: false },
      business: { type: "string", required: false },
      employments: { type: "array", itemType: "object", required: false },
      educations: { type: "array", itemType: "object", required: false },
    });

    const user = await User.findByIdAndUpdate(
      ctx.request.body.id,
      ctx.request.body
    );
    if (!user) {
      ctx.throw(404, "修改用户失败");
    }
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: "修改用户成功",
    };
  }

  /**查询特定用户 */
  async findById(ctx) {
    // 根据用户输入想查询的字段来获取
    // const { fields = "" } = ctx.query;
    // const selectFields = fields
    //   .split(";")
    //   .filter((f) => f)
    //   .map((f) => " +" + f)
    //   .join("");
    // // 动态获取query里传入的参数
    // const populateStr = fields
    //   .split(";")
    //   .filter((f) => f)
    //   .map((f) => {
    //     if (f === "employments") {
    //       return "employments.company employments.job";
    //     }
    //     if (f === "education") {
    //       return "education.school education.major";
    //     }
    //     return f;
    //   });
    // 查询过滤了的字段
    const selectFields =
      "+locations +business +employments +educations +following +followingTopics";
    const user = await User.findById(ctx.query.id)
      .select(selectFields)
      .populate(
        "following followingTopics employments.company employments.job educations.school educations.major business"
      );

    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: user,
    };
  }

  /**判断用户是否存在 中间件 */
  async checkUserExist(ctx, next) {
    const user = await User.findById(ctx.params.id);
    if (!user) {
      ctx.throw(404, "用户不存在");
    }
    await next();
  }

  /**关注某人接口 */
  async follow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    if (!me.following.map((id) => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id);
      // 保存到数据库
      me.save();
    }
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: true,
    };
    // ctx.status = 204;
  }
  /**取消关注 */
  async unfollow(ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following");
    // 取消关注的人的索引
    const index = me.following
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      // 保存到数据库
      me.save();
    }
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: true,
    };
    // ctx.status = 204;
  }

  /**获取粉丝接口 */
  async listFollowers(ctx) {
    const users = await User.find({ following: ctx.params.id });
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: users,
    };
  }

  // 获取话题关注接口
  async listFollowingTopics(ctx) {
    console.log(1);
    const user = await User.findById(ctx.params.id)
      .select("+followingTopics")
      .populate("followingTopics");
    if (!user) {
      ctx.throw(404, "用户不存在d ");
    }
    ctx.body = user.followingTopics;
  }

  // 关注某人的话题接口
  async followTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+followingTopics"
    );
    if (
      !me.followingTopics.map((id) => id.toString()).includes(ctx.params.id)
    ) {
      me.followingTopics.push(ctx.params.id);
      // 保存到数据库
      me.save();
    }
    ctx.status = 204;
  }

  // 取消关注话题
  async unfollowTopic(ctx) {
    const me = await User.findById(ctx.state.user._id).select(
      "+followingTopics"
    );
    // 取消关注的人的索引
    const index = me.followingTopics
      .map((id) => id.toString())
      .indexOf(ctx.params.id);
    if (index > -1) {
      me.followingTopics.splice(index, 1);
      // 保存到数据库
      me.save();
    }
    ctx.status = 204;
  }
}

module.exports = new UserCtl();

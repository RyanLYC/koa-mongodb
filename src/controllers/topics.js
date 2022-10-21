import Topic from "../models/topics";
const User = require("../models/users");
// 话题
class TopicsCtl {
  /**创建话题接口 */
  async create(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });
    const topic = await new Topic(ctx.request.body).save();
    ctx.body = topic;
  }

  // 查找话题接口
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
    ctx.body = await Topic
      // 实现话题的模糊搜索
      .find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(pageNo * perPage);
  }

  // 判断话题是否存在
  async checkTopicExist(ctx, next) {
    const topic = await Topic.findById(ctx.params.id);
    if (!topic) {
      ctx.throw(404, "话题不存在");
    }
    await next();
  }

  // 查找特定话题接口
  async findById(ctx) {
    const { fields = "" } = ctx.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const topic = await Topic.findById(ctx.params.id).select(selectFields);
    ctx.body = topic;
  }

  // 更新话题接口
  async update(ctx) {
    ctx.verifyParams({
      name: { type: "string", required: true },
      avatar_url: { type: "string", required: false },
      introduction: { type: "string", required: false },
    });
    const topic = await Topic.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body
    );
    ctx.body = topic;
  }

  // 获取话题粉丝接口
  async listFollowers(ctx) {
    const users = await User.find({ followingTopics: ctx.params.id });
    ctx.body = users;
  }
}

module.exports = new TopicsCtl();

const Question = require("../models/questions");

// 问题
class QuestionsCtl {
  // 查找话题接口
  async find(ctx) {
    const { per_page = 10 } = ctx.query;
    const page = Math.max(ctx.query.page * 1) - 1;
    // 接收每页有多少项 ，如果是 0 或者 -1 则使用Math函数来修正为 1
    const perPage = Math.max(ctx.query.per_page * 1, 1);
    /*
        limit(10):只返回10项
        skip(10):跳过10项

        合起来：返回第二页
        */
    const q = new RegExp(ctx.query.q);
    ctx.body = await Question
      // 实现话题的模糊搜索
      .find({ $or: [{ title: q }, { description: q }] })
      .limit(perPage)
      .skip(page * perPage);
  }

  // 判断问题是否存在
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select(
      "+questioner"
    );
    if (!question) {
      ctx.throw(404, "问题不存在");
    }
    ctx.state.question = question;
    await next();
  }

  // 查找特定问题接口
  async findById(ctx) {
    const { fields = "" } = ctx.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const question = await Question.findById(ctx.params.id)
      .select(selectFields)
      .populate("questioner");
    ctx.body = question;
  }
  // 创建问题接口
  async create(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: true },
      description: { type: "string", required: false },
    });
    const body = ctx.request.body;
    body.questioner = ctx.state.user._id;
    const question = await new Question(body).save();
    ctx.body = question;
  }

  async checkQuestioner(ctx, next) {
    const { question } = ctx.state;
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, "没有权限");
    }
    await next();
  }

  // 更新话题接口
  async update(ctx) {
    ctx.verifyParams({
      title: { type: "string", required: false },
      description: { type: "string", required: false },
    });
    await ctx.state.question.update(ctx.request.body);
    ctx.body = ctx.state.question;
  }

  // 删除
  async delete(ctx) {
    await Question.findByIdAndRemove(ctx.params.id);
    ctx.status = 204;
  }
}

module.exports = new QuestionsCtl();

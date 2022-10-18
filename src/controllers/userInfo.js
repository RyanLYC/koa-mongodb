import userInfoSvc from "../services/userInfo";
import { RESPONSE_CODE } from "../constant";

class UserInfoCtl {
  async save(ctx, next) {
    // a.b;
    ctx.verifyParams({
      usertName: { type: "string", required: true },
      age: { type: "number", required: true },
    });
    const requestBody = ctx.request.body;

    try {
      await userInfoSvc.save(requestBody);
      ctx.state.response = {
        code: RESPONSE_CODE.success,
        data: null,
      };
    } catch (e) {
      ctx.state.response = {
        code: RESPONSE_CODE.error,
        msg: "用户数据保存失败",
      };
    }
    next();
  }

  async update(ctx, next) {
    const requestBody = ctx.request.body;
    const { id } = requestBody;
    try {
      const result = await userInfoSvc.update(id, requestBody);
      ctx.state.response = {
        code: result === null ? RESPONSE_CODE.error : RESPONSE_CODE.success,
        data: null,
      };
    } catch (e) {
      ctx.state.response = {
        code: RESPONSE_CODE.error,
        msg: "用户数据更新失败",
      };
    }
    next();
  }

  async del(ctx, next) {
    const { id } = ctx.request.body;

    try {
      console.log(await userInfoSvc.deleteById(id));
      ctx.state.response = {
        code: RESPONSE_CODE.success,
        data: null,
      };
    } catch (e) {
      ctx.state.response = {
        code: RESPONSE_CODE.error,
        msg: "用户删除失败",
      };
    }
  }
}

module.exports = new UserInfoCtl();

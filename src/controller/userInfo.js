import * as services from "../services/userInfo";
import { RESPONSE_CODE } from "../constant";

export async function save(ctx, next) {
  const requestBody = ctx.request.body;

  try {
    await services.save(requestBody);
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

export async function update(ctx, next) {
  const requestBody = ctx.request.body;
  const { id } = requestBody;
  try {
    const result = await services.update(id, requestBody);
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

export async function del(ctx, next) {
  const { id } = ctx.request.body;

  try {
    console.log(await services.deleteById(id));
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

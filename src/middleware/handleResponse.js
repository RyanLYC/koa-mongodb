import { RESPONSE_CODE } from "../constant";

export function handleResponse() {
  return async function (ctx, next) {
    await next();
    if (ctx.body !== undefined && ctx.body.errors) {
      ctx.state.response = {
        code: RESPONSE_CODE.error,
        data: ctx.body.errors,
        msg: ctx.body.message,
      };
    }
    if (ctx.state.response === undefined) {
      return;
    }
    const { code, data, msg } = ctx.state.response;
    ctx.body = getResult(code, data, msg);
  };
}

function getResult(code, data, msg) {
  const result = {
    code,
    data,
    msg: undefined,
  };

  if (code === RESPONSE_CODE.error) {
    result.msg = msg;
  }

  return result;
}

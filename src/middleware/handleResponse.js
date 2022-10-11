import { RESPONSE_CODE } from "../constant";

export function handleResponse() {
  return async function (ctx, next) {
    await next();
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
    data: null,
    msg: undefined,
  };
  if (code === RESPONSE_CODE.success) {
    result.data = data;
  }

  if (code === RESPONSE_CODE.error) {
    result.msg = msg;
  }

  return result;
}

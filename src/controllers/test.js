import { RESPONSE_CODE } from "../constant";

class TestCtl {
  testGet(ctx, next) {
    console.log("testGet:", 1);
    next();
  }
  testGet2(ctx, next) {
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: { name: "test get 2" },
    };
    // next();
  }

  testPost(ctx, next) {
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: { name: "test post" },
    };
    // next();
  }

  userGet(ctx, next) {
    console.log(ctx.params); //{ id: '123' } //获取动态路由的数
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: { name: "userGet:" + ctx.params.id },
    };
    // next();
  }
}

module.exports = new TestCtl();

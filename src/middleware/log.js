export const log = () => {
  return async (ctx, next) => {
    // 记录请求开始的时间
    const start = Date.now();
    await next();
    // 记录完成的时间 作差 计算响应时间
    const responseTime = Date.now() - start;
    if (global.log) {
      global.log.info(`响应时间为${responseTime / 1000}s`);
    }
  };
};

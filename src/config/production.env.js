export default {
  // 生产环境要写在环境变量中
  db: {
    uri: "mongodb://localhost:27017/test",
  },
  secret: "lyc-jwt-secret",
  host_redis: "127.0.0.1",
  port_redis: 6379,
};

import * as log4js from "log4js";

const methods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"];
const contextLogger = {};
log4js.configure({
  appenders: {
    console: {
      type: "stdout",
    },
    cheese: {
      type: "dateFile",
      encoding: "utf-8",
      filename: "logs/globalLog",
      layout: {
        type: "pattern",
        pattern: '{"date":"%d","level":"%p","data":\'%m\'}',
      },
      pattern: "-yyyy-MM-dd.log",
      alwaysIncludePattern: true,
    },
  },
  categories: { default: { appenders: ["cheese", "console"], level: "info" } },
});

const bindLog = function () {
  const logger = log4js.getLogger("cheese");
  // 循环 methods 将所有方法挂载到ctx 上
  methods.forEach((method) => {
    contextLogger[method] = (message) => {
      logger[method](message);
    };
  });
  // 为 ctx 增加 log 方法
  Object.defineProperty(global, "log", {
    value: contextLogger,
    writable: false,
    enumerable: true,
    configurable: false,
  });
};

export default bindLog;

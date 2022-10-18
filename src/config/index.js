import development from "./development.env";
import production from "./production.env";
const envConfigs = {
  development,
  production,
};
/**windows上:  process.env.NODE_ENV
 * "dev": "SET NODE_ENV=development && nodemon ./src/index.js --exec babel-node",
 * 后面会带 空格 env.trim()
 */
/**在 macOS / OS X 或Linux 上:  process.env.NODE_ENV
 * "dev": "export NODE_ENV=development && nodemon ./src/index.js --exec babel-node",
 *
 * cross-env 夸平台配置环境变量
 * dev": "cross-env NODE_ENV=development  nodemon ./src/index.js --exec babel-node",
 */

const config = ((env) => {
  return envConfigs[env.trim()];
})(process.env.NODE_ENV);

export default config;

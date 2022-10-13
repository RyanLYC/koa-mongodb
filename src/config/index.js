import development from "./development.env";
import production from "./production.env";
const envConfigs = {
  development,
  production,
};
/**windows上:  process.env.NODE_ENV
 * "dev": "SET NODE_ENV=development && nodemon ./src/index.js --exec babel-node",
 */
/**在 macOS / OS X 或Linux 上:  process.env.NODE_ENV
 * "dev": "export NODE_ENV=development && nodemon ./src/index.js --exec babel-node",
 */

const config = (function (env) {
  return envConfigs[env.trim()];
})(process.env.NODE_ENV);

export default config;

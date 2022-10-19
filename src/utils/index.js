import jwt from "koa-jwt";
import config from "../config";

const auth = jwt({ secret: config.secret });

module.exports = { auth };

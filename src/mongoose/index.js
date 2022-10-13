import mongoose from "mongoose";
import config from "../config";

/** 随意写了个单例  */
export default class MgDb {
  static getInstance() {
    if (!MgDb.instance) {
      MgDb.instance = new MgDb();
    }
    return MgDb.instance;
  }

  constructor() {
    this.dbClient = mongoose.connection;
  }

  connect() {
    mongoose.connect(config.db.uri);
    this.dbClient.on(
      "error",
      console.error.bind(console, "mongodb connect error")
    );
    this.dbClient.once(
      "open",
      console.log.bind(console, "mongodb connect success")
    );
  }
}

// import mongoose from 'mongoose'
// import config from '../config'

// const dbClient = mongoose.connection

// export const connect = function () {
//   mongoose.connect(config.db.uri)
//   dbClient.on('error', console.error.bind(console, 'mongodb connect error'))
//   dbClient.once('open', console.log.bind(console, 'mongodb connect success'))
// }

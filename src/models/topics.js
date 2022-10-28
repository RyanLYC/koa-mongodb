const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// 话题
const topicSchema = new Schema(
  {
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    // 头像
    avatar_url: { type: String },
    // 介绍
    introduction: { type: String, select: false },
  },
  { timestamps: true }
);

module.exports = model("Topic", topicSchema);

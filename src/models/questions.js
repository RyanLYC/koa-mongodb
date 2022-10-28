const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// 问题
const questionSchema = new Schema(
  {
    _v: { type: Number, select: false },
    title: { type: String, required: true },
    description: { type: String },
    question: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      select: false,
    },
  },
  { timestamps: true } // 自动创建 创建时间 修改时间
);

module.exports = model("Question", questionSchema);

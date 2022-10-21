import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  // 设置密码，select字段是为了密码不暴露出去
  password: { type: String, required: true, select: false },
  // 头像
  avatar_url: { type: String },
  // 性别
  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
    required: true,
  },
  // 一句话介绍
  headline: { type: String },
  // 居住地
  locations: {
    type: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    select: false,
  },
  // 行业
  business: { type: Schema.Types.ObjectId, ref: "Topic", select: false },
  // 职业经历
  employments: {
    type: [
      {
        company: { type: Schema.Types.ObjectId, ref: "Topic" },
        job: { type: Schema.Types.ObjectId, ref: "Topic" },
      },
    ],
    select: false,
  },
  // 教育
  educations: {
    type: [
      {
        school: { type: Schema.Types.ObjectId, ref: "Topic" },
        major: { type: Schema.Types.ObjectId, ref: "Topic" },
        // 文凭
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        // 入学年份
        entrance_year: { type: Number },
        // 毕业年份
        graduation_year: { type: Number },
      },
    ],
    select: false,
  },
  // 关注
  following: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    select: false,
  },
  // 关注话题
  followingTopics: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
    select: false,
  },
});

export default model("User", userSchema);

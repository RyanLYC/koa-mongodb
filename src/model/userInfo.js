import mongoose from "mongoose";

const userInfoSchema = new mongoose.Schema({
  usertName: {
    type: String,
  },
  age: {
    type: Number,
  },
  sex: {
    type: String,
  },
  nickName: {
    type: String,
  },
});

export default mongoose.model("userInfo", userInfoSchema);

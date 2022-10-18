import UserInfo from "../model/userInfo";
class UserInfoSvc {
  save(params) {
    return new UserInfo(params).save();
  }

  update(id, params) {
    return UserInfo.findByIdAndUpdate(id, params);
  }

  deleteById(id) {
    return UserInfo.findByIdAndDelete(id);
  }
}

module.exports = new UserInfoSvc();

import UserInfo from "../model/userInfo";

export function save(params) {
  return new UserInfo(params).save();
}

export function update(id, params) {
  return UserInfo.findByIdAndUpdate(id, params);
}

export function deleteById(id) {
  return UserInfo.findByIdAndDelete(id);
}

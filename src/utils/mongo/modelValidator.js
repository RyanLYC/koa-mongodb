// 待验证使用
export const checkEmpty = (model, param) => {
  model.path(`${param}`).validate((val) => {
    if (val.length < 0 || val === " ") {
      return false;
    } else {
      return true;
    }
  }, `${param}字段不能为空`);
};

export const formatFilter = (filterField) => {
  let result = {};
  if (filterField instanceof Array) {
    throw `can not recieve a array`;
  }
  for (let key in filterField) {
    if (
      filterField[key] !== "" &&
      filterField[key] !== null &&
      filterField[key] !== undefined
    ) {
      result[key] = filterField[key];
    }
  }
  return result;
};

/**
 * 基础列表查询工具
 * @param model 当前查询的model
 * @param filter 查询条件，如{name:nameField}等mongo的query语法，用对象包裹
 * @param pageSize 每页数量
 * @param perPage 当前页码
 */
export const baseListApi = async (Model, filters, pageSize, perPage) => {
  let list = [];
  let total;
  await Model.find(filters)
    .limit(pageSize)
    .skip((perPage - 1) * pageSize)
    .then((res) => {
      if (res.length <= 0) {
        list = [];
        total = 0;
      } else {
        list = res;
        total = res.length;
      }
    });
  return { list, total };
};

/**
 * 基础添加工具
 * @param Model 当前查询的model
 * @param fields 添加的字段
 * @param {boolean} checkDuplicate 是否开启字段查重验证，默认开启
 * @returns {string} msg
 */
export const baseCreateApi = async (Model, fields, checkDuplicate = true) => {
  let keyArr = Object.keys(fields);
  if (keyArr.length <= 0) {
    throw `Can Not Found Any Params`;
  }
  if (checkDuplicate) {
    for (let k = 0; k < keyArr.length; k++) {
      let key = keyArr[k];
      const query = {};
      query[key] = fields[key];
      const duplicateField = await Model.findOne(query);
      if (duplicateField) throw `The Value Of Param '${key}' Was Already Set`;
    }
  }
  let msg = ``;
  try {
    let doc = new Model(fields);
    await doc.save().then((res) => {
      msg = "操作成功";
    });
  } catch (e) {
    msg = e.message ? e.message : "操作失败";
  }
  return msg;
};

/**
 *
 * @param Model 当前查询的Model
 * @param searchField 用作更新文档时唯一查询的条件，如{_id:ObjectID(uuid)}
 * @param fields 当前要更新的字段
 * @param {boolean} checkDuplicate 是否开启字段查重验证，默认开启
 * @returns {string} msg
 */
export const baseUpdateApi = async (
  Model,
  searchField,
  fields,
  checkDuplicate = true
) => {
  const uniq = Object.keys(searchField)[0];
  let keyArr = Object.keys(fields);
  if (keyArr.length <= 0) {
    throw `Can Not Found Any Params`;
  }
  if (checkDuplicate) {
    const searchOpt = {};
    searchOpt[uniq] = { $ne: searchField[uniq] };
    console.log("searchOpt", searchOpt);
    for (let k = 0; k < keyArr.length; k++) {
      let key = keyArr[k];
      let query = { ...searchOpt };
      query[key] = fields[key];
      console.log("query", JSON.stringify(query));
      const duplicateField = await Model.find(query);
      console.log("duplicateField", duplicateField);
      if (duplicateField.length > 0)
        throw `The Value Of Param '${key}' Was Already Set`;
    }
  }
  let msg = ``;
  try {
    await Model.updateOne(searchField, fields, { multi: false }).then((res) => {
      msg = `操作成功`;
    });
  } catch (e) {
    msg = e.message ? e.message : "操作失败";
  }
  return msg;
};

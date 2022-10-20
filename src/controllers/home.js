import { RESPONSE_CODE } from "../constant";
import path from "path";

class HomeCtl {
  /**上传图片接口 */
  upload(ctx) {
    const file = ctx.request.files.file;
    const basename = path.basename(file.filepath);
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: { url: `${ctx.origin}/uploads/${basename}` },
    };
  }
}

module.exports = new HomeCtl();

import { RESPONSE_CODE } from "../constant";
import path from "path";
const fse = require("fs-extra");
import uploadSvc from "../services/upload";

const UPLOAD_DIR = path.join(__dirname, "../public/uploads");

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

  /**分块上传文件 */
  async uploadFileBlock(ctx) {
    // koa-body 在处理完 file 后会绑定在 ctx.request.files
    const file = ctx.request.files.file;
    const { chunkname, ext, hash } = ctx.request.body;
    console.log("body:", hash, chunkname, ext);
    const filename = `${hash}.${ext}`;
    // 最终文件存储位置 根据chunkname获取后缀，名字用hash
    const filePath = path.resolve(UPLOAD_DIR, filename);
    // 文件存在直接返回
    if (fse.existsSync(filePath)) {
      ctx.state.response = {
        code: RESPONSE_CODE.error,
        msg: "文件存在",
        data: { url: `${ctx.origin}/uploads/${filePath}` },
      };
      return;
    }
    // 碎片文件夹，用hash命名
    const chunkPath = path.resolve(UPLOAD_DIR, hash);
    if (!fse.existsSync(chunkPath)) {
      await fse.mkdirs(chunkPath);
    }
    await fse.move(file.filepath, `${chunkPath}/${chunkname}`, {
      overwrite: true,
    });
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      data: { url: `${ctx.origin}/uploads/${hash}/${chunkname}` },
    };
  }

  async merge(ctx) {
    const { ext, size, hash } = ctx.request.body;
    const filePath = path.resolve(UPLOAD_DIR, `${hash}.${ext}`);
    await uploadSvc.mergeFileChunk(UPLOAD_DIR, filePath, hash, size);
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      msg: "合并成功",
      data: { url: `${ctx.origin}/uploads/${`${hash}.${ext}`}` },
    };
  }

  async checkFile(ctx) {
    const { ext, hash } = ctx.request.body;
    const filePath = path.resolve(UPLOAD_DIR, `${hash}.${ext}`);
    console.log(filePath);
    // 文件是否存在
    let uploaded = false;
    let uploadedList = [];
    if (fse.existsSync(filePath)) {
      // 存在文件，直接返回已上传
      uploaded = true;
    } else {
      const dirPath = path.resolve(UPLOAD_DIR, hash);
      // 文件没有完全上传完毕，但是可能存在部分切片上传完毕了
      uploadedList = (await fse.existsSync(dirPath))
        ? (await fse.readdir(dirPath)).filter((name) => name[0] !== ".") // 过滤诡异的隐藏文件 比如.DS_store
        : [];
    }
    ctx.state.response = {
      code: RESPONSE_CODE.success,
      msg: "合并成功",
      data: { uploaded, uploadedList },
    };
  }
}

module.exports = new HomeCtl();

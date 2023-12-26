const path = require("path");
const fse = require("fs-extra");
import { pipeline } from "stream/promises";

class UploadSvc {
  async mergeFiles(files, dest, size) {
    const pipeStream = (filePath, writeStream) => {
      const readStream = fse.createReadStream(filePath);
      return pipeline(readStream, writeStream);
    };
    // new Promise((resolve) => {
    //   const readStream = fse.createReadStream(filePath);
    //   readStream
    //     .on("finish", () => {
    //       // 删除文件
    //       fse.unlinkSync(filePath);
    //       resolve();
    //     })
    //     .on("error", () => {
    //       console.log("error");
    //     });

    //   readStream.pipe(writeStream);
    // });

    await Promise.all(
      files.map((file, index) => {
        const start = index * size;
        const end = (index + 1) * size;
        pipeStream(
          file,
          fse.createWriteStream(dest, {
            start,
            end,
          })
        );
      })
    );
  }

  async mergeFileChunk(dirPath, filePath, fileHash, size) {
    const chunkDir = path.resolve(dirPath, fileHash);
    let chunkPaths = await fse.readdir(chunkDir);
    // 根据切片下标进行排序
    // 否则直接读取目录的获得的顺序可能会错乱
    chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
    chunkPaths = chunkPaths.map((cp) => path.resolve(chunkDir, cp)); // 转成文件路径

    /**appendFileSync 合并 */
    chunkPaths.map((chunkPath) => {
      fse.appendFileSync(filePath, fse.readFileSync(chunkPath));
    });

    /** 流合并 windows 合并有问题*/
    await this.mergeFiles(chunkPaths, filePath, size);

    // 删除文件夹
    fse.remove(chunkDir);
  }
}
module.exports = new UploadSvc();

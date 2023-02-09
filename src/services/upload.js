const path = require("path");
const fse = require("fs-extra");

class UploadSvc {
  async mergeFiles(files, dest, size) {
    const pipeStream = (filePath, writeStream) =>
      new Promise((resolve) => {
        const readStream = fse.createReadStream(filePath);
        readStream.on("end", () => {
          // 删除文件
          fse.unlinkSync(filePath);
          resolve();
        });
        readStream.pipe(writeStream);
      });

    await Promise.all(
      files.map((file, index) =>
        pipeStream(
          file,
          fse.createWriteStream(dest, {
            start: index * size,
            // flags: "a", // https://www.jianshu.com/p/0806008d175d
            end: (index + 1) * size,
          })
        )
      )
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
    // await this.mergeFiles(chunkPaths, filePath, size);

    // 删除文件夹
    fse.remove(chunkDir);
  }
}
module.exports = new UploadSvc();

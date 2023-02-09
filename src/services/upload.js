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
      // 合并文件
      fse.appendFileSync(filePath, fse.readFileSync(chunkPath));
    });

    // 删除文件夹
    fse.remove(chunkDir);

    /** 流合并 该写法有问题 应该要用callBack的写法才保证合并顺序*/
    // await this.mergeFiles(chunkPaths, filePath, size);

    // 参考函数
    //   function mergeChunks(fileName, chunks, callback) {
    //     console.log('chunks:' + chunks);
    //     let chunkPaths = chunks.map(function (name) {
    //         return path.join(process.env.IMAGESDIR, name)
    //     });

    //     // 采用Stream方式合并
    //     let targetStream = fs.createWriteStream(path.join(process.env.IMAGESDIR, fileName));
    //     const readStream = function (chunkArray, cb) {
    //         let path = chunkArray.shift();
    //         let originStream = fs.createReadStream(path);
    //         originStream.pipe(targetStream, {end: false});
    //         originStream.on("end", function () {
    //             // 删除文件
    //             fs.unlinkSync(path);
    //             if (chunkArray.length > 0) {
    //                 readStream(chunkArray, callback)
    //             } else {
    //                 cb()
    //             }
    //         });
    //     };
    //     readStream(chunkPaths, callback);
    // }
  }
}
module.exports = new UploadSvc();

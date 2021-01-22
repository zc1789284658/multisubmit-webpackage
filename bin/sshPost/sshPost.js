/* eslint-disable */
const fs = require("fs");
const archiver = require("archiver");
const chalk = require("chalk");
const { NodeSSH } = require("node-ssh");
const { uploadProgressEmitter } = require("./emitter");
const { distPath, distTargetPath } = require("./dist-path");

const ssh = new NodeSSH();
const cwd = process.cwd();

//压缩dist目录为public.zip
async function upload({ modifiedName, config }) {
  console.log("host:", chalk.blueBright(config.host));
  console.log("开始压缩dist目录...");

  let archive = archiver("zip", {
    zlib: { level: 9 },
  }).on("error", function (err) {
    throw err;
  });

  let oldPath = distPath;
  let newPath = `${distTargetPath}/${modifiedName}.zip`;
  let remoteFilePath = `${config.path}/${modifiedName}.zip`;
  let logPath = `${cwd}/bin/log/${modifiedName}-${Date.now()}.log`; //日志目录

  let output = fs.createWriteStream(newPath);

  output.on("close", function (err) {
    /*压缩结束时会触发close事件，然后才能开始上传，
          否则会上传一个内容不全且无法使用的zip包*/
    if (err) {
      console.log(chalk.red("关闭archiver异常:", err));
      return;
    }
    console.log(chalk.blue("已生成zip包"));
    console.log(`开始上传${chalk.blue(newPath)}至远程机器...`);
    uploadFile(
      Object.assign(config, {
        zipPath: newPath,
        remoteFilePath,
        logPath,
      })
    );
  });

  archive.pipe(output); //典型的node流用法
  archive.directory(oldPath, "/"); //压到zip包的哪一层，如原封不动，则压倒root  /根层
  archive.finalize();
}

//将dist目录上传至正式环境
function uploadFile({
  host,
  username,
  password,
  port,
  path: remoteDirPath,
  remoteFilePath,
  zipPath,
  logPath,
}) {
  ssh
    .connect({
      //configs存放的是连接远程机器的信息
      host,
      username,
      password,
      port, //SSH连接默认在22端口
    })
    .then(function () {
      //上传网站的发布包至configs中配置的远程服务器的指定地址
      console.log(chalk.magenta(zipPath, remoteFilePath));
      ssh
        .putFile(zipPath, remoteFilePath)
        .then(function (status) {
          console.log(chalk.blueBright("上传文件成功", status));
          console.log(chalk.blueBright("开始执行远端脚本"));
          sshUnzip({ remoteDirPath, remoteFilePath, logPath }); //上传成功后触发远端脚本
        })
        .catch((err) => {
          console.log(chalk.red("文件传输异常:", err));
          uploadProgressEmitter.emit("kill");
        });
    })
    .catch((err) => {
      console.log(chalk.red("ssh连接失败:", err));
      uploadProgressEmitter.emit("kill");
    });
}

//执行远端部署脚本
function sshUnzip({ remoteDirPath, remoteFilePath, logPath }) {
  //在服务器上cwd配置的路径下执行sh deploy.sh脚本来实现发布
  let unzipShell = `unzip -o -a ${remoteFilePath} -d ${remoteDirPath}`;

  console.log(`远程解压脚本：${chalk.cyanBright(unzipShell)}`);

  ssh.execCommand(unzipShell, { cwd: remoteDirPath }).then(function (result) {
    try {
      fs.writeFileSync(logPath, result.stdout);
    } catch (e) {
      console.log(chalk.red(`写入远程解压日志失败：\r\n${e}`));
    }
    if (!result.stderr) {
      console.log(chalk.green("远程解压成功!"));
      uploadProgressEmitter.emit("kill");
    } else {
      console.log(chalk.red(`远程解压异常：${result.stderr}`));
    }
  });
}

module.exports = {
  upload,
};

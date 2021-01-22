#!/usr/bin/env node
/* eslint-disable */
const chalk = require("chalk"); //美化命令行
const inquirer = require("inquirer"); //问答式命令行
const { ConfigMap } = require("./config");
const { upload } = require("./sshPost");
const { uploadProgressEmitter } = require("./emitter");

/**
 * start process
 */
console.log(chalk.greenBright("欢迎使用kushim前端发布工具\r\n"));

const questions = [
  {
    type: "list",
    name: "host",
    message: "发布到哪个域名?",
    choices: Object.keys(ConfigMap),
    filter: function(val) {
      return val.toLowerCase();
    }
  },
  {
    type: "input",
    name: "modifiedName",
    message: "请输入包名（系统将打包dist文件夹，并修改为您输入的包名进行提交）",
    validate: function(value) {
      let pass =
        value.length > 0 &&
        !value.includes("\\") &&
        !value.includes("//") &&
        !value.includes(":") &&
        !value.includes("*") &&
        !value.includes("?") &&
        !value.includes('"') &&
        !value.includes("<") &&
        !value.includes(">") &&
        !value.includes("|");

      if (pass) {
        return true;
      }

      return "请输入合法的包名（）";
    }
  }
];

inquirer.prompt(questions).then(async answers => {
  let conf = ConfigMap[answers.host];

  if (Array.isArray(conf)) {
    let count = 0;

    let l = conf.length;

    uploadProgressEmitter.on("kill", () => {
      console.log(chalk.yellow(count));
      if (++count === conf.length) process.exit(0);
    });

    //必要时也可以改为emitter触发流程
    for (let i = 0; i < l; i++) {
      let config = conf[i];
      try {
        await setTimeout(async () => {
          await upload(
            Object.assign(answers, {
              config
            })
          );
        }, i * 3000);
      } catch (e) {
        console.log(config);
      }
    }
  } else {
    uploadProgressEmitter.on("kill", () => {
      process.exit(0);
    });
    upload(
      Object.assign(answers, {
        config: ConfigMap[answers.host]
      })
    );
  }
});

## 1.放到 web 项目目录下，与 src 同级

## 2.配置：参照./bin/readme

## 3.使用方法

- 1.项目目录下 node bin/sshPost/index.js
- 2.加入到 package.json 中

  "scripts": {
  "push": "node bin/sshPost/index.js"
  }

- 3.然后 npm run push

## 4.可能需要安装 chalk/inquirer/archiver/node-ssh

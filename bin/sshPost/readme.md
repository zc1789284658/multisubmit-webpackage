# Usage of sshPost

## create config.js

- 复制 [config_template.js](./config_template.js) 到同级目录，改名为 config.js（默认提供一个空的 config.js，按照 config_template.js 的格式进行服务器自定义）

## modify config.js

- 在 [config.js](./config.js) 中修改 config 对象，多个远程终端可配置多个 config

- ConfigMap 可以设置 key value，key 最终将显示在命令行中用于用户选择

## if u need or get dir error，u could modify sshPost.js

- 如果目录不对应，或者想修改文件目录相关内容
- 可修改 [dist-path.js](./dist-path.js)
  中的参数 sshPost.js 中的 oldPath/newPath/remoteFilePath/logPath

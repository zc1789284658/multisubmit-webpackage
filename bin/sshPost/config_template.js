// copy this to create config.js in the same dir
// then change the host/username/password/port/path
/**
 * !!!!!!!!!!!
 * WHEN work with other member，if the ssh password is secret,
 * you cannot post config.js to git or any share util
 **/

const confDev = {
  host: "?.?.?.?",
  username: "username1",
  password: "password1",
  port: 6666,
  path: "/usr/local/xxx/xxx/web1",
};
const confOnlineDev = {
  host: "?.?.?.?",
  username: "username2",
  password: "password2",
  port: 6666,
  path: "/usr/local/xxx/xxx/web2",
};
const confOnlinePro = {
  host: "?.?.?.?",
  username: "username3",
  password: "password3",
  port: 6666,
  path: "/usr/local/xxx/xxx/web3",
};
// ......
const confOnlineProN = {
  host: "?.?.?.?",
  username: "username3",
  password: "password3",
  port: 6666,
  path: "/usr/local/xxx/xxx/web3",
};

//可以根据需求配置多个自定义配置

const ConfigMap = {
  confDev, //单次上传
  confOnlineDev, //单次上传
  confOnlinePro, //单次上传
  confOnlineProN, //单次上传
  "all above": [confDev, confOnlineDev, confOnlinePro, confOnlineProN], //批量上传1
  "some conf combine": [confOnlineDev, confOnlinePro, confOnlineProN], //批量上传2 可以根据组合进行设置一次性上传到哪些服务器
};

module.exports = {
  ConfigMap,
};

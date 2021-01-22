# 这是一个支持npm web项目进行一次性打包上传到多个服务器的小工具

## 1.放到 web 项目目录下，与 src 同级

## 2.配置：参照./bin/readme

## 3.使用方法

- 方法1.项目目录下 直接跑 node bin/sshPost/index.js
- 方法2.将上述命令行加入到 package.json 中，如
```
  "scripts": {
    "push": "node bin/sshPost/index.js"
  }
  ## 然后 npm run push
```
## 4.可能需要安装 chalk/inquirer/archiver/node-ssh

## 5.如果每个服务器的相对路径都不一样，建议在web代码中，根据location.href进行axios baseUrl的区分，如

```
# base-url-config.js
// (function simplefiedKushimConfig() {
let baseURL = "";
let href = window.location.href;

let BaseURLIncludeMap = {
  "192.168.": "/rxxpa/",
  "172.18": "/rxpxa/",
  "dev-web": "/xxxx/dev-server/",
  "pro-web": "/xxx/pro-server/",
  "t.github": "http://t.kushimai.com/rpa-server/",
  "dev.github": "http://dev.kushimai.com/rpa/",
  "github.com": "http://aaaaaam/server/",
  "rpa.kushimai": "http://xxxxx/server/",
  "local-web": "/rpa/local-server/"
};


Object.keys(BaseURLIncludeMap).forEach(_ => {
  if (href.includes(_)) {
    baseURL = BaseURLIncludeMap[_] || baseURL;
    imageURL = imageURLIncludeMap[_] || imageURL;
  }
});

//electron等环境时，location.href无http词缀
if (!href.includes("http")) {
  baseURL = "http://dev.xxxxx.com/xxxxx/";
}


export {
  baseURL
}

```


```
import {baseURL} from 'xxxx/base-url-config.js'

axios.defaults.baseURL = baseURL;
```

### 6.如果方案5不满意，可以建立一个固定ip的服务，讲各服务器中baseURL等配置配置在数据库中，从数据库中获取

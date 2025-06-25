# event-bus-ts

<p align="center">
  <a href="https://www.npmjs.com/package/@easygame/event-bus-ts">
    <img src="https://img.shields.io/npm/v/@easygame/event-bus-ts" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@easygame/event-bus-ts">
    <img src="https://img.shields.io/npm/dm/@easygame/event-bus-ts" alt="Download">
  </a>
  <a href="https://github.com/funxinjian/event-bus-ts/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/@easygame/event-bus-ts" alt="LICENSE">
  </a>
</p>

简体中文 | [English](/README.md)

适用于 TypeScript 的简单事件总线库。

## 安装

```bash
npm install @easygame/event-bus-ts
```

## 使用

```TypeScript

import { EventBus } from "@easygame/event-bus-ts";
const eventBus = new EventBus();

const func = (data: string) => {
    console.log("data =", data);
};
/** 注册事件 */
eventBus.on("event",func)
/** 发送事件 */
eventBus.emit("event", "hello world");
/** 取消事件 */
eventBus.off("event",func)

```

## 开源协议

该项目的代码和文档基于 [MIT](/LICENSE) 开源协议。

## 贡献

欢迎拉取请求。如需重大修改，请先开启一个问题，讨论您想要修改的内容。

## 免责声明

1.一般免责声明：本项目仅供学习和研究使用，严禁用于任何违反当地法律法规的行为。使用本项目所造成的任何后果，由使用者自行承担，本项目作者不承担任何法律责任。

2.适用性声明：本项目内容可能不适用于所有情况或系统，在实际应用前请充分测试和评估。若因使用不当造成的任何问题，本项目作者不承担任何责任。

使用本项目即表示您已经阅读并同意上述免责声明。

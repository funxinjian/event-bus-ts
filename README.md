# event-bus-ts

Simple EventBus library for TypeScript.

### Install

```bash
npm install @easygame/event-bus-ts
```

## Usage

```TypeScript

import { EventBus } from "@easygame/event-bus-ts";
const eventBus = new EventBus();

const func = (data: string) => {
    console.log("data =", data);
};
/** 注册事件 */
eventBus.on("event",func)
/** 触发事件 */
eventBus.emit("event", "hello world");
/** 取消事件 */
eventBus.off("event",func)

```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## issues

[issues](https://github.com/funxinjian/event-bus-ts/issues)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

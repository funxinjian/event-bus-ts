# event-bus-ts

Simple EventBus library for TypeScript.

## Install

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
/** register event */
eventBus.on("event",func)
/** emit event */
eventBus.emit("event", "hello world");
/** unregister event */
eventBus.off("event",func)

```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## issues

[issues](https://github.com/funxinjian/event-bus-ts/issues)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Disclaimer

1. General Disclaimer: This project is for study and research purposes only, and is strictly prohibited to be used for any violation of local laws and regulations. Any consequences caused by the use of this project shall be borne by the user, and the author of this project shall not bear any legal responsibility.

2. Declaration of Applicability: The content of this program may not be applicable to all situations or systems, please fully test and evaluate before actual application. The author of this program does not assume any responsibility for any problems caused by improper use.

Use of this program means that you have read and agree to the above disclaimer.

import { EventBus } from "@easygame/event-bus-ts";

const bus = new EventBus();

let data = 0;
const setCount = (num: number) => {
    data = num;
    console.log("set data =", data);
};
/** 注册事件 */
bus.on("test-emit", setCount);
console.log("data1 =", data); // 0
console.log("total1 =", bus.total()); // 1

/** 发送事件 */
bus.emit("test-emit", 1);
console.log("data2 =", data); // 1

/** 取消事件 */
bus.off("test-emit", setCount);
console.log("data3 =", data); // 1

/** 再发送事件, 无人响应 */
bus.emit("test-emit", 3);
console.log("data4 =", data); // 1
console.log("total2 =", bus.total()); // 0

bus.clear();
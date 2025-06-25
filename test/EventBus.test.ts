import { EventBus } from "../src/EventBus";

test('test-on-emit-off', () => {
    const bus = new EventBus();
    let count = 0;
    const setCount = (num: number) => {
        count = num;
        console.log("count =", count);
    };
    /** 注册事件 */
    bus.on("test-emit", setCount);
    expect(count).toBe(0);
    expect(bus.total()).toBe(1);
    /** 发送事件 */
    bus.emit("test-emit", 1);
    expect(count).toBe(1);
    /** 取消事件 */
    bus.off("test-emit", setCount);
    expect(bus.total()).toBe(0);
    /** 再发送事件, 无人响应 */
    bus.emit("test-emit", 3);
    expect(count).toBe(1);
});

test('test-on-emit-off2', () => {
    const bus = new EventBus();
    let count = 0;
    const setCount = (num: number) => {
        count = num;
        console.log("count =", count);
        bus.off("test-emit", setCount);
        const dd = 3 / 0;
        console.log("dd =", dd);
    };
    /** 注册事件 */
    bus.on("test-emit", setCount);
    expect(count).toBe(0);
    expect(bus.total()).toBe(1);
    /** 发送事件 */
    bus.emit("test-emit", 1);
    expect(count).toBe(1);
    expect(bus.total()).toBe(0);
    /** 执行一次后被取消, 再发送事件, 无人响应 */
    bus.emit("test-emit", 3);
    expect(count).toBe(1);
});
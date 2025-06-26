import { EventBus } from "../src";

test('test-event-bus', () => {
    const bus = new EventBus();

    let value1 = "1";
    let value2 = "2";
    let value3 = "3";

    const setData = (v1: string, v2: string, v3: string) => {
        value1 = v1;
        value2 = v2;
        value3 = v3;
        console.log("setCount value =", v1, v2, v3);
    };
    const EventKey = "test-event-bus";

    /** 测试注册、发送、移除事件 */
    /** 注册事件 */
    bus.on(EventKey, setData);
    /** 注册事件, 剩余 total 应该为 1 */
    expect(bus.total()).toBe(1);

    /** 发送事件 */
    bus.emit(EventKey, "发送事件, 应该被打印!", "第1次");
    expect(value1).toBe("发送事件, 应该被打印!");
    expect(value2).toBe("第1次");

    bus.emit(EventKey, "发送事件, 应该被打印!", "第2次");
    expect(value1).toBe("发送事件, 应该被打印!");
    expect(value2).toBe("第2次");

    /** 取消事件 */
    bus.off(EventKey, setData);

    /** 再发送事件, 无人响应 */
    bus.emit(EventKey, "发送事件, 事件已经被移除了, 不应该被打印!");
    expect(value1).toBe("发送事件, 应该被打印!");
    expect(value2).toBe("第2次");


    /** 测试回调中移除事件 */
    const onceCallback = (v1: string, v2: string, v3: string) => {
        value1 = v1;
        value2 = v2;
        value3 = v3;
        console.log("onceCallback value =", v1, v2, v3);
        bus.off(EventKey, onceCallback);
        /** 已经取消, 方法内再发送事件, 也无人响应 */
        bus.emit(EventKey, "发送事件, 事件已经被移除了, 不应该被打印! 2");
    };
    bus.on(EventKey, onceCallback);
    bus.emit(EventKey, "发送事件, 只会执行这一次的回调! 本次应该打印!", "第1次");
    expect(value1).toBe("发送事件, 只会执行这一次的回调! 本次应该打印!");
    expect(value2).toBe("第1次");

    bus.emit(EventKey, "发送事件, 事件已经被移除了, 不应该被打印! 3", "第2次");
    expect(value1).toBe("发送事件, 只会执行这一次的回调! 本次应该打印!");
    expect(value2).toBe("第1次");

    /** 测试通过 tag 移除事件 */
    const tag = { tag: "111" };
    bus.on(EventKey, setData, tag);
    bus.emit(EventKey, "发送事件, 测试带 tag 的回调, 通过 tag 移除事件, 本次应该打印!1", "第1次");
    expect(value1).toBe("发送事件, 测试带 tag 的回调, 通过 tag 移除事件, 本次应该打印!1");
    expect(value2).toBe("第1次");

    bus.emit(EventKey, "发送事件, 测试带 tag 的回调, 通过 tag 移除事件, 本次应该打印!2", "第2次");
    expect(value1).toBe("发送事件, 测试带 tag 的回调, 通过 tag 移除事件, 本次应该打印!2");
    expect(value2).toBe("第2次");

    bus.offTag(tag);
    bus.emit(EventKey, "发送事件, 事件已经被移除了, 不应该被打印! 4");
    expect(value1).toBe("发送事件, 测试带 tag 的回调, 通过 tag 移除事件, 本次应该打印!2");
    expect(value2).toBe("第2次");

    /** 测试清空事件 */
    bus.on(EventKey, setData, tag);
    bus.emit(EventKey, "发送事件, 测试清空事件, 本次应该打印!1", "第1次");
    expect(value1).toBe("发送事件, 测试清空事件, 本次应该打印!1");
    expect(value2).toBe("第1次");

    bus.emit(EventKey, "发送事件, 测试清空事件, 本次应该打印!2", "第2次");
    expect(value1).toBe("发送事件, 测试清空事件, 本次应该打印!2");
    expect(value2).toBe("第2次");

    bus.clear();
    bus.emit(EventKey, "发送事件, 事件已经被清空了, 不应该被打印!");

    /** 清空事件, 剩余 total 应该为 0 */
    expect(bus.total()).toBe(0);
});
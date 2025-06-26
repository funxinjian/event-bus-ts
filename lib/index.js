class EventItem {
    constructor(listener, tag) {
        this.lock = 0;
        this.listener = listener;
        this.tag = tag;
        this.lock = 0;
    }
    reset() {
        this.listener = undefined;
        this.tag = undefined;
        this.lock = 0;
    }
}
class EventItemGroup {
    constructor() {
        this.array = [];
        this.lock = 0;
    }
}
/**
 * 事件总线
 */
export class EventBus {
    static getDefault() {
        return EventBus.defaultEventBus || (EventBus.defaultEventBus = new EventBus());
    }
    constructor() {
        this.mEventMap = new Map();
        this.mEventItemPool = [];
        this.errorHandler = (error) => {
            console.error(error);
        };
    }
    /**
     * 设置错误处理函数
     * @param handler 错误处理函数
     */
    setErrorHandler(handler) {
        if (typeof handler === "function") {
            this.errorHandler = handler;
        }
    }
    /**
     * 注册事件
     * @param eventKey
     * @param listener
     * @param tag
     * @returns 注册 id，用于注销（注册失败时候返回 -1）
     */
    on(eventKey, listener, tag) {
        if (eventKey != null && typeof listener === "function") {
            let itemGroup = this.mEventMap.get(eventKey);
            if (itemGroup == null) {
                this.mEventMap.set(eventKey, (itemGroup = new EventItemGroup()));
            }
            let eventItem = this.mEventItemPool.pop();
            if (eventItem) {
                eventItem.listener = listener;
                eventItem.tag = tag;
                eventItem.lock = 0;
            }
            else {
                eventItem = new EventItem(listener, tag);
            }
            itemGroup.array.push(eventItem);
            return { off: () => this.off(eventKey, listener) };
        }
        return null;
    }
    /**
     * 注销事件
     * @param eventKey
     * @param listener
     */
    off(eventKey, listener) {
        const itemGroup = this.mEventMap.get(eventKey);
        if (itemGroup && itemGroup.array.length > 0) {
            const isRemove = itemGroup.lock === 0;
            for (let index = itemGroup.array.length - 1; index > -1; index--) {
                const eventItem = itemGroup.array[index];
                if (eventItem && eventItem.listener === listener) {
                    itemGroup.array[index] = null;
                    eventItem.reset();
                    this.mEventItemPool.push(eventItem);
                    if (isRemove) {
                        itemGroup.array.splice(index, 1);
                    }
                }
            }
        }
    }
    /**
     * 注销事件 by tag
     * @param tag
     */
    offTag(tag) {
        for (const eventKey of this.mEventMap.keys()) {
            const itemGroup = this.mEventMap.get(eventKey);
            if (itemGroup && itemGroup.array.length > 0) {
                const isRemove = itemGroup.lock === 0;
                for (let index = itemGroup.array.length - 1; index > -1; index--) {
                    const eventItem = itemGroup.array[index];
                    if (eventItem && eventItem.tag === tag) {
                        itemGroup.array[index] = null;
                        eventItem.reset();
                        this.mEventItemPool.push(eventItem);
                        if (isRemove) {
                            itemGroup.array.splice(index, 1);
                        }
                    }
                }
            }
        }
    }
    /**
     *  注销所有事件
     */
    clear() {
        this.mEventMap.clear();
        this.mEventItemPool.length = 0;
    }
    /**
     * 发送事件
     * @param eventKey
     * @param args
     */
    emit(eventKey, ...args) {
        const itemGroup = this.mEventMap.get(eventKey);
        if (itemGroup && itemGroup.array.length > 0) {
            const length = itemGroup.array.length;
            /** 为了保证注册顺序即响应顺序, 所以要顺序查找, 又为了防止在执行过程中，有新的事件注册或取消，导致事件列表发生变化，所以加一层锁 */
            itemGroup.lock++;
            let emptyCount = 0;
            for (let index = 0; index < length; index++) {
                const eventItem = itemGroup.array[index];
                if (eventItem && eventItem.listener) {
                    try {
                        eventItem.listener(...args);
                    }
                    catch (error) {
                        this.errorHandler(error);
                    }
                }
                else {
                    emptyCount++;
                }
            }
            itemGroup.lock--;
            if (itemGroup.lock === 0) {
                this.removeEmptyItems(itemGroup.array);
            }
        }
    }
    removeEmptyItems(eventArray) {
        for (let index = eventArray.length - 1; index > -1; index--) {
            const eventItem = eventArray[index];
            if (!eventItem) {
                eventArray.splice(index, 1);
            }
        }
    }
    /**
     * 获取注册事件的数量
     * @param eventKey
     * @returns
     */
    count(eventKey) {
        const itemGroup = this.mEventMap.get(eventKey);
        return itemGroup ? itemGroup.array.length : 0;
    }
    /**
     *  获取注册事件的总数
     * @returns
     */
    total() {
        let count = 0;
        for (const itemGroup of this.mEventMap.values()) {
            count += itemGroup.array.length;
        }
        return count;
    }
}
/** 默认的 EventBus 实例 */
EventBus.defaultEventBus = null;

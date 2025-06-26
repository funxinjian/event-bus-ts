

class EventItem {
    public listener: ((...args: any[]) => any) | undefined;
    public tag: object | undefined;
    public lock: number = 0;

    constructor(listener: (...args: any[]) => any, tag?: object) {
        this.lock = 0;
        this.listener = listener;
        this.tag = tag;
    }

    public reset(): void {
        this.listener = undefined;
        this.tag = undefined;
        this.lock = 0;
    }
}

class EventItemGroup {
    array: EventItem[] = [];
    lock: number = 0;
}

export type EventKey = number | string | symbol | Function | object;

export interface IEventHandle {
    off(): void;
}
/**
 * 事件总线
 */
export class EventBus {
    /** 默认的 EventBus 实例 */
    private static defaultEventBus: EventBus = null as unknown as EventBus;
    public static getDefault(): EventBus {
        return EventBus.defaultEventBus || (EventBus.defaultEventBus = new EventBus());
    }
    constructor() { }
    private mEventMap: Map<EventKey, EventItemGroup> = new Map();
    private mEventItemPool: EventItem[] = [];
    private errorHandler: (error: any) => void = (error: any) => {
        console.error(error);
    };

    /**
     * 设置错误处理函数
     * @param handler 错误处理函数
     */
    public setErrorHandler(handler: (error: any) => void) {
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
    public on(eventKey: EventKey, listener: (...args: any[]) => any, tag?: object): IEventHandle | null {
        if (eventKey != null && typeof listener === "function") {
            let itemGroup = this.mEventMap.get(eventKey);
            if (itemGroup == null) {
                this.mEventMap.set(eventKey, (itemGroup = new EventItemGroup()));
            }
            let eventItem = this.mEventItemPool.pop();
            if (!eventItem) {
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
    public off(eventKey: EventKey, listener: (...args: any[]) => any): void {
        const itemGroup = this.mEventMap.get(eventKey);
        if (itemGroup && itemGroup.array.length > 0) {
            const isRemove = itemGroup.lock === 0;
            for (let index = itemGroup.array.length - 1; index > -1; index--) {
                const eventItem = itemGroup.array[index];
                if (eventItem && eventItem.listener === listener) {
                    itemGroup.array[index] = null as unknown as EventItem;
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
    public offTag(tag: object): void {
        for (const eventKey of this.mEventMap.keys()) {
            const itemGroup = this.mEventMap.get(eventKey)!;
            if (itemGroup && itemGroup.array.length > 0) {
                const isRemove = itemGroup.lock === 0;
                for (let index = itemGroup.array.length - 1; index > -1; index--) {
                    const eventItem = itemGroup.array[index];
                    if (eventItem && eventItem.tag === tag) {
                        itemGroup.array[index] = null as unknown as EventItem;
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
    public clear(): void {
        this.mEventMap.clear();
        this.mEventItemPool.length = 0;
    }

    /**
     * 发送事件
     * @param eventKey
     * @param args
     */
    public emit(eventKey: EventKey, ...args: any[]): void {
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
                    } catch (error) {
                        this.errorHandler(error);
                    }
                } else {
                    emptyCount++;
                }
            }
            itemGroup.lock--;
            if (itemGroup.lock === 0) {
                this.removeEmptyItems(itemGroup.array);
            }
        }
    }

    private removeEmptyItems(eventArray: EventItem[]) {
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
    public count(eventKey: EventKey): number {
        const itemGroup = this.mEventMap.get(eventKey);
        return itemGroup ? itemGroup.array.length : 0;
    }

    /**
     *  获取注册事件的总数
     * @returns
     */
    public total(): number {
        let count = 0;
        for (const itemGroup of this.mEventMap.values()) {
            count += itemGroup.array.length;
        }
        return count;
    }
}

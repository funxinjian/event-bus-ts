export type EventKey = number | string | symbol | object;
export interface IEventHandle {
    off(): void;
}
/**
 * 事件总线
 */
export declare class EventBus {
    /** 默认的 EventBus 实例 */
    private static defaultEventBus;
    static getDefault(): EventBus;
    constructor();
    private mEventMap;
    private mEventItemPool;
    private errorHandler;
    /**
     * 设置错误处理函数
     * @param handler 错误处理函数
     */
    setErrorHandler(handler: (error: any) => void): void;
    /**
     * 注册事件
     * @param eventKey
     * @param listener
     * @param tag
     * @returns 注册 id，用于注销（注册失败时候返回 -1）
     */
    on(eventKey: EventKey, listener: (...args: any[]) => any, tag?: object): IEventHandle | null;
    /**
     * 注销事件
     * @param eventKey
     * @param listener
     */
    off(eventKey: EventKey, listener: (...args: any[]) => any): void;
    /**
     * 注销事件 by tag
     * @param tag
     */
    offTag(tag: object): void;
    /**
     *  注销所有事件
     */
    clear(): void;
    /**
     * 发送事件
     * @param eventKey
     * @param args
     */
    emit(eventKey: EventKey, ...args: any[]): void;
    private removeEmptyItems;
    /**
     * 获取注册事件的数量
     * @param eventKey
     * @returns
     */
    count(eventKey: EventKey): number;
    /**
     *  获取注册事件的总数
     * @returns
     */
    total(): number;
}
//# sourceMappingURL=index.d.ts.map
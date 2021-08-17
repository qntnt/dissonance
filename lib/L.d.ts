declare class TaggedLogger {
    private tag;
    constructor(tag?: string);
    private buildLogger;
    v: (message: string, ...args: any[]) => void;
    i: (message: string, ...args: any[]) => void;
    w: (message: string, ...args: any[]) => void;
    e: (message: string, ...args: any[]) => void;
    silly: (message: string, ...args: any[]) => void;
    http: (message: string, ...args: any[]) => void;
    static tag(tag: string): TaggedLogger;
}
export default class L {
    private static _defaultLogger;
    static v: (message: string, ...args: any[]) => void;
    static i: (message: string, ...args: any[]) => void;
    static w: (message: string, ...args: any[]) => void;
    static e: (message: string, ...args: any[]) => void;
    static silly: (message: string, ...args: any[]) => void;
    static http: (message: string, ...args: any[]) => void;
    static tag: typeof TaggedLogger.tag;
}
export {};

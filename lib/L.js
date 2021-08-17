"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const npmlog = __importStar(require("npmlog"));
const ENV = process.env['NODE_ENV'];
const DEBUG = ENV !== 'production';
npmlog.default.level = DEBUG ? 'verbose' : 'error';
class TaggedLogger {
    constructor(tag = '') {
        // GENERAL LOG LEVELS
        this.v = this.buildLogger(npmlog.verbose);
        this.i = this.buildLogger(npmlog.info);
        this.w = this.buildLogger(npmlog.warn);
        this.e = this.buildLogger(npmlog.error);
        // SPECIAL LOG LEVELS
        this.silly = this.buildLogger(npmlog.silly);
        this.http = this.buildLogger(npmlog.http);
        this.tag = tag;
    }
    buildLogger(logger) {
        return (message, ...args) => {
            logger(this.tag, message, ...args);
        };
    }
    // TAGGING
    static tag(tag) {
        return new TaggedLogger(tag);
    }
}
class L {
}
exports.default = L;
L._defaultLogger = new TaggedLogger();
// GENERAL LOG LEVELS
L.v = L._defaultLogger.v;
L.i = L._defaultLogger.i;
L.w = L._defaultLogger.w;
L.e = L._defaultLogger.e;
// SPECIAL LOG LEVELS
L.silly = L._defaultLogger.silly;
L.http = L._defaultLogger.http;
L.tag = TaggedLogger.tag;

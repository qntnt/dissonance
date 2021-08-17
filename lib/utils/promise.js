"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayedRetry = exports.retry = exports.delay = void 0;
const console_1 = require("console");
const L_1 = __importDefault(require("../L"));
/**
 * Creates a promise to delay a number of milliseconds
 *
 * @param ms The number of milliseconds to delay
 * @returns A promise that resolves after `ms` milliseconds
 */
function delay(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        L_1.default.v(`Delaying ${ms}ms...`);
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    });
}
exports.delay = delay;
/**
 * Retry a task.
 *
 * @param task The async task function
 * @param times The number of times to retry the task. Default = MAX_SAFE_INTEGER
 * @returns The result of first successful task
 */
function retry(task, times = Number.MAX_SAFE_INTEGER) {
    return __awaiter(this, void 0, void 0, function* () {
        console_1.assert(times >= 0, 'Arg "times" must be a non-negative number.');
        return yield _retry(task, times);
    });
}
exports.retry = retry;
function _retry(task, times) {
    return __awaiter(this, void 0, void 0, function* () {
        if (times < 0)
            throw new Error('Max retries reached.');
        const result = yield task();
        if (result)
            return result;
        return _retry(task, times - 1);
    });
}
/**
 * Retry a task with a delay between each retry.
 *
 * @param task The async task function
 * @param times The number of times to retry the task. Default = MAX_SAFE_INTEGER
 * @param delayMs The number of milliseconds to delay between retries
 * @returns The result of first successful task
 */
function delayedRetry(task, delayMs, times = Number.MAX_SAFE_INTEGER) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield retry(() => __awaiter(this, void 0, void 0, function* () {
            const result = yield task();
            if (result)
                return result;
            yield delay(delayMs);
            return undefined;
        }), times);
    });
}
exports.delayedRetry = delayedRetry;

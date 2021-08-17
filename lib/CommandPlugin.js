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
exports.MessageCommandPlugin = exports.SlashCommandPlugin = void 0;
const L_1 = __importDefault(require("./L"));
/**
 * CommandPlugin lifecycle
 * - attach
 * - start
 * - validateCommand
 * - parseArgs (required)
 * - validateArgs
 * - handle (required)
 * - cleanup
 */
class CommandPlugin {
    attach() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    run(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.start(ctx);
                const shouldHandle = yield this.validateCommand(ctx);
                if (!shouldHandle)
                    return 'UNHANDLED';
            }
            catch (e) {
                L_1.default.e(e);
                return 'UNHANDLED';
            }
            try {
                const args = yield this.parseArgs(ctx);
                yield this.validateArgs(ctx, args);
                yield this.handle(ctx, args);
                yield this.cleanup(ctx, args);
            }
            catch (e) {
                L_1.default.e(e);
                yield ctx.reply('There was an issue processing this command.');
            }
            return 'HANDLED';
        });
    }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    validateCommand(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return ctx.validateCommandName(this.commandDef.name);
        });
    }
    validateArgs(ctx, args) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    cleanup(ctx, args) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = CommandPlugin;
class SlashCommandPlugin extends CommandPlugin {
}
exports.SlashCommandPlugin = SlashCommandPlugin;
class MessageCommandPlugin extends CommandPlugin {
}
exports.MessageCommandPlugin = MessageCommandPlugin;

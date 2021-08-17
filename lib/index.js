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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = exports.MessageCommandPlugin = exports.SlashCommandPlugin = exports.CommandPlugin = exports.Intents = void 0;
const discord_js_1 = require("discord.js");
Object.defineProperty(exports, "Intents", { enumerable: true, get: function () { return discord_js_1.Intents; } });
const CommandPlugin_1 = __importStar(require("./CommandPlugin"));
exports.CommandPlugin = CommandPlugin_1.default;
Object.defineProperty(exports, "MessageCommandPlugin", { enumerable: true, get: function () { return CommandPlugin_1.MessageCommandPlugin; } });
Object.defineProperty(exports, "SlashCommandPlugin", { enumerable: true, get: function () { return CommandPlugin_1.SlashCommandPlugin; } });
const Context_1 = __importDefault(require("./Context"));
exports.Context = Context_1.default;
const Dissonance_1 = __importDefault(require("./Dissonance"));
exports.default = Dissonance_1.default;

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
const discord_js_1 = require("discord.js");
const CommandPlugin_1 = __importDefault(require("../CommandPlugin"));
const Dissonance_1 = __importDefault(require("../Dissonance"));
const L_1 = __importDefault(require("../L"));
const applicationId = process.env['DISCORD_APPLICATION_ID'];
if (!applicationId) {
    throw new Error('You need to set the DISCORD_APPLICATION_ID environment variable.');
}
const token = process.env['DISCORD_TOKEN'];
if (!token) {
    throw new Error('You need to set the DISCORD_TOKEN environment variable.');
}
Dissonance_1.default.init({
    applicationId: applicationId,
    discordToken: token,
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS'
    ]
});
class TestCommandPlugin extends CommandPlugin_1.default {
    constructor() {
        super(...arguments);
        this.commandDef = {
            type: 'CHAT_INPUT',
            name: 'dissonance',
            description: 'Test command for Dissonance framework',
            options: [
                {
                    name: 'echo',
                    description: 'Text to respond with',
                    type: 'STRING',
                },
                {
                    name: 'bool',
                    description: 'A boolean option',
                    type: 'BOOLEAN',
                },
                {
                    name: 'int',
                    description: 'A boolean option',
                    type: 'INTEGER',
                    choices: [
                        {
                            name: 'default',
                            value: 0
                        },
                    ]
                },
            ],
        };
        this._log = L_1.default.tag('TestCommandPlugin');
    }
    attach() {
        const _super = Object.create(null, {
            attach: { get: () => super.attach }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.attach.call(this);
            this._log.i('Attached');
        });
    }
    start(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.reply('Starting');
        });
    }
    validateCommand(ctx) {
        const _super = Object.create(null, {
            validateCommand: { get: () => super.validateCommand }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this._log.i('Validating command');
            yield ctx.reply('Validating command');
            return _super.validateCommand.call(this, ctx);
        });
    }
    parseArgs(ctx) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            this._log.i('Parsing args');
            yield ctx.reply('Parsing args');
            if (ctx.isCommandInteraction()) {
                const options = ctx.interaction.options;
                return {
                    echo: ((_b = (_a = options.get('echo')) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 'undefined'),
                    bool: ((_d = (_c = options.get('bool')) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : false),
                    int: ((_f = (_e = options.get('int')) === null || _e === void 0 ? void 0 : _e.value) !== null && _f !== void 0 ? _f : 0),
                };
            }
            if (ctx.isMessageInteraction()) {
                return {
                    echo: 'undefined',
                    bool: false,
                    int: 0,
                };
            }
            throw new Error('Could not parse args from unknown interaction');
        });
    }
    handle(ctx, { echo, bool, int }) {
        return __awaiter(this, void 0, void 0, function* () {
            this._log.i('Handled');
            yield ctx.reply('Handling');
            yield ctx.reply({
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .addField('echo', echo)
                        .addField('bool', bool.toString())
                        .addField('int', int.toString())
                ]
            });
        });
    }
    cleanup(ctx, args) {
        const _super = Object.create(null, {
            cleanup: { get: () => super.cleanup }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.cleanup.call(this, ctx, args);
            this._log.i('Cleaned up');
        });
    }
}
Dissonance_1.default.registerCommandPlugins(new TestCommandPlugin());

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
const Context_1 = __importDefault(require("./Context"));
const CommandRegistrar_1 = __importDefault(require("./CommandRegistrar"));
const L_1 = __importDefault(require("./L"));
const promise_1 = require("./utils/promise");
const DEFAULT_BOT_PREFIX = '! ';
class Dissonance {
    constructor(intents, botPrefix) {
        const discordClient = new discord_js_1.Client({
            intents: intents,
        });
        this.ctx = Context_1.default.createRoot(discordClient, botPrefix);
        this.commandPlugins = [];
    }
    static init({ applicationId, discordToken, intents, botPrefix = DEFAULT_BOT_PREFIX, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._instance) {
                throw new Error('Dissonance is already initialized.');
            }
            this.log.i('Dissonance is initializing...');
            this._status = 'INITIALIZING';
            const instance = new Dissonance(intents, botPrefix);
            instance.startListening();
            instance.commandRegistrar = new CommandRegistrar_1.default(applicationId, discordToken);
            yield promise_1.retry(() => __awaiter(this, void 0, void 0, function* () {
                return yield instance.ctx.login(discordToken);
            }));
            this._instance = instance;
            this._status = 'INITIALIZED';
        });
    }
    static client() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._status === 'UNINITIALIZED')
                throw new Error('Dissonance is not initialized. Call `init()` first.');
            return yield promise_1.delayedRetry(() => __awaiter(this, void 0, void 0, function* () {
                const instance = this._instance;
                if (!instance) {
                    this.log.i('Waiting for client...');
                }
                return instance;
            }), 1000);
        });
    }
    static registerCommandPlugins(...plugins) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.client();
            client._registerCommandPlugins(...plugins);
        });
    }
    _registerCommandPlugins(...plugins) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.commandPlugins = plugins;
            this.commandPlugins.forEach(plugin => plugin.attach());
            (_a = this.commandRegistrar) === null || _a === void 0 ? void 0 : _a.registerPluginCommands(plugins);
        });
    }
    startListening() {
        this.ctx.discordClient.on('ready', (client) => __awaiter(this, void 0, void 0, function* () {
            Dissonance.log = L_1.default.tag('Dissonance <ready>');
            Dissonance.log.i('Dissonance is ready.', client.user.id);
        }));
        this.ctx.discordClient.on('messageCreate', (message) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (message.author.id === ((_a = this.ctx.botUser) === null || _a === void 0 ? void 0 : _a.id))
                return;
            Dissonance.log.v('Received message: ', message.content);
            const result = yield this.runPlugins(this.ctx.withMessage(message));
            if (result === 'HANDLED') {
                Dissonance.log.v('Handled');
            }
        }));
        this.ctx.discordClient.on('interactionCreate', (interaction) => __awaiter(this, void 0, void 0, function* () {
            if (interaction.isCommand()) {
                Dissonance.log.v('Received command: ', interaction.commandName, interaction.options);
                const result = yield this.runPlugins(this.ctx.withCommandInteraction(interaction));
            }
            else {
                Dissonance.log.v('Received interaction: ', interaction);
            }
        }));
    }
    runPlugins(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const plugin of this.commandPlugins) {
                const result = yield plugin.run(ctx);
                if (result === 'HANDLED')
                    return result;
            }
            return 'UNHANDLED';
        });
    }
}
exports.default = Dissonance;
Dissonance._status = 'UNINITIALIZED';
Dissonance.log = L_1.default.tag('Dissonance <not ready>');

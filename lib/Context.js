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
const L_1 = __importDefault(require("./L"));
class Context {
    constructor(discordClient, interaction, botPrefix = '!') {
        this.discordClient = discordClient;
        this.interaction = interaction;
        this.botPrefix = botPrefix;
    }
    static createRoot(discordClient, botPrefix) {
        return new Context(discordClient, undefined, botPrefix);
    }
    isReady() {
        return this.discordClient.isReady();
    }
    withInteraction(interaction) {
        return new Context(this.discordClient, interaction);
    }
    withMessage(message) {
        return this.withInteraction(message);
    }
    withCommandInteraction(command) {
        return this.withInteraction(command);
    }
    get botUser() {
        return this.discordClient.user;
    }
    login(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.discordClient.login(token);
        });
    }
    reply(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.interaction)
                throw new Error('Cannot send to a context with no interaction.');
            let payload = options;
            if (typeof payload === 'string') {
                payload = {
                    embeds: [
                        new discord_js_1.MessageEmbed({ title: payload })
                    ]
                };
            }
            if (this.isMessageInteraction()) {
                if (this.replyMessage) {
                    this.replyMessage = yield this.replyMessage.edit(payload);
                }
                else {
                    this.replyMessage = yield this.interaction.channel.send(payload);
                }
                return;
            }
            if (this.isCommandInteraction()) {
                if (this.interaction.replied) {
                    yield this.interaction.editReply(payload);
                }
                else {
                    yield this.interaction.reply(payload);
                }
                return;
            }
            throw new Error('Tried to send to invalid interaction type.');
        });
    }
    validateCommandName(commandName) {
        if (this.isMessageInteraction()) {
            return this.validateMessageCommand(commandName, this.interaction);
        }
        if (this.isCommandInteraction()) {
            return this.interaction.commandName === commandName;
        }
        return false;
    }
    validateMessageCommand(commandName, message) {
        const content = message.content.trim();
        L_1.default.v('Validating message command: ', content);
        if (content.startsWith(this.botPrefix)) {
            const botStripped = content.substring(this.botPrefix.length).trim();
            return botStripped.startsWith(commandName);
        }
        return false;
    }
    cleanMessageContent(commandName) {
        if (this.isMessageInteraction()) {
            const content = this.interaction.content.trim();
            if (content.startsWith(this.botPrefix)) {
                const botStripped = content.substring(this.botPrefix.length).trim();
                if (botStripped.startsWith(commandName)) {
                    return botStripped.substring(commandName.length).trim();
                }
            }
        }
        return undefined;
    }
    isMessageInteraction() {
        return this.interaction.content !== undefined;
    }
    isCommandInteraction() {
        return this.interaction.commandName !== undefined;
    }
}
exports.default = Context;

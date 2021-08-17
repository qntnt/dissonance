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
exports.optionTypeValues = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const L_1 = __importDefault(require("./L"));
const record_1 = require("./utils/record");
exports.optionTypeValues = {
    'SUB_COMMAND': 1,
    'SUB_COMMAND_GROUP': 2,
    'STRING': 3,
    'INTEGER': 4,
    'BOOLEAN': 5,
    'USER': 6,
    'CHANNEL': 7,
    'ROLE': 8,
    'MENTIONABLE': 9,
    'NUMBER': 10,
};
const optionValueTypes = record_1.reverseRecord(exports.optionTypeValues);
const commandTypeValues = {
    'CHAT_INPUT': 1,
    'USER': 2,
    'MESSAGE': 3,
};
const commandValueTypes = record_1.reverseRecord(commandTypeValues);
class CommandRegistrar {
    constructor(applicationId, token) {
        this.log = L_1.default.tag('CommandRegistrar');
        this.rest = new rest_1.REST({ version: '9' }).setToken(token);
        this.commandsRoute = v9_1.Routes.applicationCommands(applicationId);
    }
    auditCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            const appCommands = yield this.getCommands();
            this.log.i('Existing app commands: ', appCommands);
        });
    }
    registerPluginCommands(plugins) {
        return __awaiter(this, void 0, void 0, function* () {
            const defs = plugins.map(p => p.commandDef);
            this.log.v('Registering commands', defs);
            const remoteCommands = yield this.getCommands();
            const commandsEqual = this.commandDefsEq(remoteCommands, defs);
            if (commandsEqual) {
                this.log.v('All commands are currently registered.');
                return;
            }
            yield this.putCommands(defs);
            this.log.v('Registered commands');
        });
    }
    listEq(eq, ts1, ts2) {
        if (ts1 === undefined) {
            if (ts2 === undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            if (ts2 === undefined) {
                return false;
            }
            else {
                if (ts1.length !== ts2.length) {
                    return false;
                }
                for (const o1 of ts1) {
                    const i = ts2.findIndex((o2) => eq(o1, o2));
                    if (i === -1)
                        return false;
                }
                return true;
            }
        }
    }
    commandDefsEq(cs1, cs2) {
        return this.listEq((a, b) => this.commandDefEq(a, b), cs1, cs2);
    }
    commandDefEq(c1, c2) {
        const optionsEqual = this.optionDefsEq(c1.options, c2.options);
        return (c1.name === c2.name
            && c1.description === c2.description
            && optionsEqual);
    }
    optionDefsEq(os1, os2) {
        return this.listEq((o1, o2) => this.optionDefEq(o1, o2), os1, os2);
    }
    optionDefEq(o1, o2) {
        return (o1.name === o2.name
            && o1.description === o2.description
            && o1.type === o2.type);
    }
    getCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = (yield this.rest.get(this.commandsRoute));
            return this.deserializeAll(response);
        });
    }
    putCommands(defs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rest.put(this.commandsRoute, {
                body: this.serializeAll(defs)
            });
        });
    }
    serializeAll(defs) {
        return defs.map(this.serialize);
    }
    serialize(commandDef) {
        var _a;
        return Object.assign(Object.assign({}, commandDef), { type: commandDef.type ? commandTypeValues[commandDef.type] : undefined, options: (_a = commandDef.options) === null || _a === void 0 ? void 0 : _a.map(o => (Object.assign(Object.assign({}, o), { type: o.type ? exports.optionTypeValues[o.type] : undefined }))) });
    }
    deserializeAll(defs) {
        return defs.map(this.deserialize);
    }
    deserialize(commandDef) {
        var _a;
        return Object.assign(Object.assign({}, commandDef), { type: commandDef.type ? commandValueTypes[commandDef.type] : undefined, options: (_a = commandDef.options) === null || _a === void 0 ? void 0 : _a.map((o) => (Object.assign(Object.assign({}, o), { type: o.type ? optionValueTypes[o.type] : undefined }))) });
    }
}
exports.default = CommandRegistrar;

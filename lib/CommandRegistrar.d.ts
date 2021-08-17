import { ICommandPlugin } from './CommandPlugin';
export interface OptionChoice {
    name: string;
    value: string | number;
}
export declare type OptionType = 'SUB_COMMAND' | 'SUB_COMMAND_GROUP' | 'STRING' | 'INTEGER' | 'BOOLEAN' | 'USER' | 'CHANNEL' | 'ROLE' | 'MENTIONABLE' | 'NUMBER';
export declare const optionTypeValues: Record<OptionType, number>;
export interface OptionDef {
    type: OptionType;
    name: string;
    description: string;
    required?: boolean;
    choices?: OptionChoice[];
    options?: OptionDef[];
}
export declare type CommandType = 'CHAT_INPUT' | 'USER' | 'MESSAGE';
export interface CommandDef {
    type?: CommandType;
    name: string;
    description: string;
    options?: OptionDef[];
}
export default class CommandRegistrar {
    private rest;
    private commandsRoute;
    private log;
    constructor(applicationId: string, token: string);
    auditCommands(): Promise<void>;
    registerPluginCommands(plugins: ICommandPlugin[]): Promise<void>;
    listEq<T>(eq: (t1: T, t2: T) => boolean, ts1: T[] | undefined, ts2: T[] | undefined): boolean;
    commandDefsEq(cs1: CommandDef[], cs2: CommandDef[]): boolean;
    commandDefEq(c1: CommandDef, c2: CommandDef): boolean;
    optionDefsEq(os1: OptionDef[] | undefined, os2: OptionDef[] | undefined): boolean;
    optionDefEq(o1: OptionDef, o2: OptionDef): boolean;
    getCommands(): Promise<CommandDef[]>;
    putCommands(defs: CommandDef[]): Promise<unknown>;
    private serializeAll;
    private serialize;
    private deserializeAll;
    private deserialize;
}

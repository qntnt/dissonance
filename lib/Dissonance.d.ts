import { BitFieldResolvable, IntentsString } from "discord.js";
import { ICommandPlugin } from "./CommandPlugin";
export declare type IntentsResolvable = BitFieldResolvable<IntentsString, number>;
interface DissonanceOptions {
    applicationId: string;
    discordToken: string;
    intents: IntentsResolvable;
    botPrefix?: string;
}
export default class Dissonance {
    private static _status;
    private static _instance?;
    private static log;
    private commandPlugins;
    private ctx;
    private commandRegistrar?;
    private constructor();
    static init({ applicationId, discordToken, intents, botPrefix, }: DissonanceOptions): Promise<void>;
    private static client;
    static registerCommandPlugins(...plugins: ICommandPlugin[]): Promise<void>;
    private _registerCommandPlugins;
    startListening(): void;
    private runPlugins;
}
export {};

import { Client, CommandInteraction, Message, MessageOptions, MessagePayload } from 'discord.js';
import { Interaction } from './Interaction';
declare type Sendable = string | MessagePayload | MessageOptions;
export declare type RootContext = Context<boolean, Interaction | undefined>;
export default class Context<Ready extends boolean, I extends Interaction | undefined> {
    discordClient: Client<Ready>;
    interaction: I;
    botPrefix: string;
    replyMessage?: Message;
    private constructor();
    static createRoot<Ready extends boolean>(discordClient: Client<Ready>, botPrefix?: string): Context<Ready, undefined>;
    isReady(): this is Context<true, I>;
    private withInteraction;
    withMessage(message: Message): Context<Ready, Message>;
    withCommandInteraction(command: CommandInteraction): Context<Ready, CommandInteraction>;
    get botUser(): Ready extends true ? import("discord.js").ClientUser : Ready extends false ? null : import("discord.js").ClientUser | null;
    login(token: string): Promise<string>;
    reply(options: Sendable): Promise<void>;
    validateCommandName(commandName: string): boolean;
    private validateMessageCommand;
    cleanMessageContent(commandName: string): string | undefined;
    isMessageInteraction(): this is Context<Ready, Message>;
    isCommandInteraction(): this is Context<Ready, CommandInteraction>;
}
export {};

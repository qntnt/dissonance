import { CommandInteraction, Message } from "discord.js";
import { CommandDef } from "./CommandRegistrar";
import Context from "./Context";
import { Interaction } from "./Interaction";
export declare type CommandResult = 'HANDLED' | 'UNHANDLED';
export declare type PluginContext<I extends Interaction> = Context<true, I>;
export interface ICommandPlugin {
    commandDef: CommandDef;
    run(ctx: PluginContext<Interaction>): Promise<CommandResult>;
    attach(): Promise<void>;
}
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
export default abstract class CommandPlugin<I extends Interaction, Args> implements ICommandPlugin {
    abstract commandDef: CommandDef;
    attach(): Promise<void>;
    run(ctx: Context<true, I>): Promise<CommandResult>;
    start(ctx: PluginContext<I>): Promise<void>;
    validateCommand(ctx: PluginContext<I>): Promise<boolean>;
    abstract parseArgs(ctx: PluginContext<I>): Promise<Args>;
    validateArgs(ctx: PluginContext<I>, args: Args): Promise<void>;
    abstract handle(ctx: PluginContext<I>, args: Args): Promise<void>;
    cleanup(ctx: PluginContext<I>, args: Args): Promise<void>;
}
export declare abstract class SlashCommandPlugin<Args> extends CommandPlugin<CommandInteraction, Args> {
}
export declare abstract class MessageCommandPlugin<Args> extends CommandPlugin<Message, Args> {
}

import { CommandInteraction, Message } from "discord.js";
import { CommandDef } from "./CommandRegistrar";
import Context from "./Context";
import { Interaction } from "./Interaction";
import L from "./L";

export type CommandResult = 'HANDLED' | 'UNHANDLED'

export type PluginContext<I extends Interaction> = Context<true, I>

export interface ICommandPlugin {
  commandDef: CommandDef
  run(ctx: PluginContext<Interaction>): Promise<CommandResult>
  attach(): Promise<void>
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
  abstract commandDef: CommandDef

  async attach(): Promise<void> {}

  async run(ctx: Context<true, I>): Promise<CommandResult> {
    try {
      await this.start(ctx)
      const shouldHandle = await this.validateCommand(ctx)
      if (!shouldHandle) return 'UNHANDLED'
    } catch(e) {
      L.e(e)
      return 'UNHANDLED'
    }
    try {
      const args = await this.parseArgs(ctx)
      await this.validateArgs(ctx, args)
      await this.handle(ctx, args)
      await this.cleanup(ctx, args)
    } catch(e) {
      L.e(e)
      await ctx.reply('There was an issue processing this command.')
    }
    return 'HANDLED'

  }

  async start(ctx: PluginContext<I>): Promise<void> {}

  async validateCommand(ctx: PluginContext<I>): Promise<boolean> {
    return ctx.validateCommandName(this.commandDef.name)
  }

  abstract parseArgs(ctx: PluginContext<I>): Promise<Args>

  async validateArgs(ctx: PluginContext<I>, args: Args): Promise<void> {}

  abstract handle(ctx: PluginContext<I>, args: Args): Promise<void>

  async cleanup(ctx: PluginContext<I>, args: Args): Promise<void> {}
}

export abstract class SlashCommandPlugin<Args> extends CommandPlugin<CommandInteraction, Args> {

}
export abstract class MessageCommandPlugin<Args> extends CommandPlugin<Message, Args> {

}
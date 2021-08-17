import { MessageEmbed } from "discord.js";
import CommandPlugin, { PluginContext } from "../CommandPlugin";
import { CommandDef } from "../CommandRegistrar";
import Dissonance from "../Dissonance";
import { Interaction } from "../Interaction";
import L from "../L";

const applicationId = process.env['DISCORD_APPLICATION_ID']
if (!applicationId) {
  throw new Error('You need to set the DISCORD_APPLICATION_ID environment variable.')
}
const token = process.env['DISCORD_TOKEN']
if (!token) {
  throw new Error('You need to set the DISCORD_TOKEN environment variable.')
}

Dissonance.init({
  applicationId: applicationId,
  discordToken: token,
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS'
  ]
})

interface TestCommandArgs {
  echo: string
  bool: boolean
  int: number
}

class TestCommandPlugin extends CommandPlugin<Interaction, TestCommandArgs> {
  commandDef: CommandDef = {
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
  }
  private _log = L.tag('TestCommandPlugin')

  async attach(): Promise<void> {
    super.attach()
    this._log.i('Attached')
  }

  async start(ctx: PluginContext<Interaction>): Promise<void> {
    await ctx.reply('Starting')
  }

  async validateCommand(ctx: PluginContext<Interaction>): Promise<boolean> {
    this._log.i('Validating command')
    await ctx.reply('Validating command')
    return super.validateCommand(ctx)
  }

  async parseArgs(ctx: PluginContext<Interaction>): Promise<TestCommandArgs> {
    this._log.i('Parsing args')
    await ctx.reply('Parsing args')
    if (ctx.isCommandInteraction()) {
      const options = ctx.interaction.options
      return {
        echo: (options.get('echo')?.value ?? 'undefined') as string,
        bool: (options.get('bool')?.value ?? false) as boolean,
        int: (options.get('int')?.value ?? 0) as number,
      }
    }
    if (ctx.isMessageInteraction()) {
       return {
         echo: 'undefined',
         bool: false,
         int: 0,
       }
     }
     throw new Error('Could not parse args from unknown interaction')
  }

  async handle(ctx: PluginContext<Interaction>, { echo, bool, int}: TestCommandArgs): Promise<void> {
    this._log.i('Handled')
    await ctx.reply('Handling')
    await ctx.reply({
      embeds: [
        new MessageEmbed()
          .addField('echo', echo)
          .addField('bool', bool.toString())
          .addField('int', int.toString())
      ]
    })
  }

  async cleanup(ctx: PluginContext<Interaction>, args: TestCommandArgs): Promise<void> {
    super.cleanup(ctx, args)
    this._log.i('Cleaned up')
  }
}

Dissonance.registerCommandPlugins(
  new TestCommandPlugin()
)
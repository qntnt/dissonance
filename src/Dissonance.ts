import { BitFieldResolvable, Client, IntentsString } from "discord.js"
import { CommandResult, ICommandPlugin } from "./CommandPlugin"
import Context, { RootContext } from "./Context"
import CommandRegistrar from "./CommandRegistrar"
import { Interaction } from "./Interaction"
import L from "./L"
import { delayedRetry, retry } from "./utils/promise"


export type IntentsResolvable = BitFieldResolvable<IntentsString, number>

const DEFAULT_BOT_PREFIX = '! '

interface DissonanceOptions {
  applicationId: string
  discordToken: string
  intents: IntentsResolvable
  botPrefix?: string
}

type DissonanceStatus = 'UNINITIALIZED' | 'INITIALIZING' | 'INITIALIZED'

export default class Dissonance {
  private static _status: DissonanceStatus = 'UNINITIALIZED'
  private static _instance?: Dissonance
  private static log = L.tag('Dissonance <not ready>')
  private commandPlugins: ICommandPlugin[]
  private ctx: RootContext
  private commandRegistrar?: CommandRegistrar

  private constructor(
    intents: IntentsResolvable,
    botPrefix: string,
  ) {
    const discordClient = new Client({ 
      intents: intents,
    })
    this.ctx = Context.createRoot(discordClient, botPrefix)
    this.commandPlugins = []
  }

  public static async init({
    applicationId,
    discordToken,
    intents,
    botPrefix = DEFAULT_BOT_PREFIX,
  }: DissonanceOptions): Promise<void> {
    if (this._instance) {
      throw new Error('Dissonance is already initialized.')
    }
    this.log.i('Dissonance is initializing...')
    this._status = 'INITIALIZING'
    const instance = new Dissonance(
      intents, 
      botPrefix
    )
    instance.startListening()
    instance.commandRegistrar = new CommandRegistrar(applicationId, discordToken)
    await retry(async () => {
      return await instance.ctx.login(discordToken) 
    })

    this._instance = instance
    this._status = 'INITIALIZED'
  }

  private static async client(): Promise<Dissonance> {
    if (this._status === 'UNINITIALIZED') throw new Error('Dissonance is not initialized. Call `init()` first.')
    return await delayedRetry(async () => {
      const instance = this._instance
      if (!instance) {
        this.log.i('Waiting for client...')
      }
      return instance
    }, 1000)
  }

  public static async registerCommandPlugins(...plugins: ICommandPlugin[]): Promise<void> {
    const client = await this.client()
    client._registerCommandPlugins(...plugins)
  }
    
  private async _registerCommandPlugins(...plugins: ICommandPlugin[]): Promise<void> {
    this.commandPlugins = plugins
    this.commandPlugins.forEach(plugin => plugin.attach())
    this.commandRegistrar?.registerPluginCommands(plugins)
  }

  startListening() {
    this.ctx.discordClient.on('ready', async (client) => {
      Dissonance.log = L.tag('Dissonance <ready>')
      Dissonance.log.i('Dissonance is ready.', client.user.id)
    })
    this.ctx.discordClient.on('messageCreate', async message => {
      if (message.author.id === this.ctx.botUser?.id) return
      Dissonance.log.v('Received message: ', message.content)
      const result = await this.runPlugins(this.ctx.withMessage(message))
      if (result === 'HANDLED') {
        Dissonance.log.v('Handled')
      }
    })
    this.ctx.discordClient.on('interactionCreate', async interaction => {
      if (interaction.isCommand()) {
        Dissonance.log.v('Received command: ', interaction.commandName, interaction.options)
        const result = await this.runPlugins(this.ctx.withCommandInteraction(interaction))
      } else {
        Dissonance.log.v('Received interaction: ', interaction)
      }
    })
  }

  private async runPlugins(ctx: Context<true, Interaction>): Promise<CommandResult> {
    for (const plugin of this.commandPlugins) {
      const result = await plugin.run(ctx)
      if (result === 'HANDLED') return result
    }
    return 'UNHANDLED'
  }
}
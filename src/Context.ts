import { Client, CommandInteraction, Message, MessageEmbed, MessageOptions, MessagePayload } from 'discord.js'
import { Interaction } from './Interaction'
import L from './L'

type Sendable = string | MessagePayload | MessageOptions

export type RootContext = Context<boolean, Interaction | undefined>

export default class Context<Ready extends boolean, I extends Interaction | undefined> {
  discordClient: Client<Ready>
  interaction: I
  botPrefix: string
  replyMessage?: Message

  private constructor(
    discordClient: Client<Ready>,
    interaction: I,
    botPrefix: string = '!'
  ) {
    this.discordClient = discordClient
    this.interaction = interaction
    this.botPrefix = botPrefix
  }

  static createRoot<Ready extends boolean>(
    discordClient: Client<Ready>,
    botPrefix?: string,
  ): Context<Ready, undefined> {
    return new Context(discordClient, undefined, botPrefix)
  }

  isReady(): this is Context<true, I> {
    return this.discordClient.isReady()
  }

  private withInteraction<I2 extends Interaction>(interaction: I2): Context<Ready, I2> {
    return new Context(
      this.discordClient,
      interaction,
    )
  }

  withMessage(message: Message): Context<Ready, Message> {
    return this.withInteraction(message)
  }

  withCommandInteraction(command: CommandInteraction) {
    return this.withInteraction(command)
  }

  get botUser() {
    return this.discordClient.user
  }

  async login(token: string): Promise<string> {
    return await this.discordClient.login(token)
  }

  async reply(options: Sendable): Promise<void> {
    if (!this.interaction) throw new Error('Cannot send to a context with no interaction.')
    let payload = options
    if (typeof payload === 'string') {
      payload = {
        embeds: [
          new MessageEmbed({title: payload})
        ]
      }
    }
    if (this.isMessageInteraction()) {
      if (this.replyMessage) {
        this.replyMessage = await this.replyMessage.edit(payload)
      } else {
        this.replyMessage = await this.interaction.channel.send(payload)
      }
      return
    }
    if (this.isCommandInteraction()) {
      if (this.interaction.replied) {
        await this.interaction.editReply(payload)
      } else {
        await this.interaction.reply(payload)
      }
      return
    }
    throw new Error('Tried to send to invalid interaction type.')
  }

  validateCommandName(commandName: string): boolean {
    if (this.isMessageInteraction()) {
      return this.validateMessageCommand(commandName, this.interaction)
    }
    if (this.isCommandInteraction()) {
      return this.interaction.commandName === commandName
    } 
    return false
  }

  private validateMessageCommand(commandName: string, message: I & Message): boolean {
    const content = message.content.trim()
    L.v('Validating message command: ', content)
    if (content.startsWith(this.botPrefix)) {
      const botStripped = content.substring(this.botPrefix.length).trim()
      return botStripped.startsWith(commandName)
    }
    return false
  }

  cleanMessageContent(commandName: string): string | undefined {
    if (this.isMessageInteraction()) {
      const content = this.interaction.content.trim()
      if (content.startsWith(this.botPrefix)) {
        const botStripped = content.substring(this.botPrefix.length).trim()
        if (botStripped.startsWith(commandName)) {
          return botStripped.substring(commandName.length).trim()
        }
      }
    } 
    return undefined
  }

  isMessageInteraction(): this is Context<Ready, Message> {
    return (this.interaction as Message).content !== undefined
  }

  isCommandInteraction(): this is Context<Ready, CommandInteraction> {
    return (this.interaction as CommandInteraction).commandName !== undefined
  }
}
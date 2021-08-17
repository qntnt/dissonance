import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { ICommandPlugin } from './CommandPlugin';
import L from './L';
import { reverseRecord } from './utils/record';

export interface OptionChoice {
  name: string
  value: string | number
}

export type OptionType
  = 'SUB_COMMAND'
  | 'SUB_COMMAND_GROUP'
  | 'STRING'
  | 'INTEGER'
  | 'BOOLEAN'
  | 'USER'
  | 'CHANNEL'
  | 'ROLE'
  | 'MENTIONABLE'
  | 'NUMBER'

export const optionTypeValues: Record<OptionType, number> = {
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
}

const optionValueTypes = reverseRecord(optionTypeValues)

export interface OptionDef {
  type: OptionType
  name: string
  description: string
  required?: boolean
  choices?: OptionChoice[]
  options?: OptionDef[]
}

export type CommandType
  = 'CHAT_INPUT'
  | 'USER'
  | 'MESSAGE'

const commandTypeValues: Record<CommandType, number> = {
  'CHAT_INPUT': 1,
  'USER': 2,
  'MESSAGE': 3,
}

const commandValueTypes = reverseRecord(commandTypeValues)

export interface CommandDef {
  type?: CommandType
  name: string
  description: string
  options?: OptionDef[]
}

export default class CommandRegistrar {
  private rest: REST
  private commandsRoute: string
  private log = L.tag('CommandRegistrar')

  constructor(applicationId: string, token: string) {
    this.rest = new REST({ version: '9' }).setToken(token)
    this.commandsRoute = Routes.applicationCommands(applicationId)
  }

  async auditCommands() {
    const appCommands = await this.getCommands()
    this.log.i('Existing app commands: ', appCommands)
  }

  async registerPluginCommands(plugins: ICommandPlugin[]) {
    const defs = plugins.map(p => p.commandDef)
    this.log.v('Registering commands', defs)
    const remoteCommands = await this.getCommands()
    const commandsEqual = this.commandDefsEq(remoteCommands, defs)
    if (commandsEqual) {
      this.log.v('All commands are currently registered.')
      return
    }
    await this.putCommands(defs)
    this.log.v('Registered commands')
  }

  listEq<T>(eq: (t1: T, t2: T) => boolean, ts1: T[] | undefined, ts2: T[] | undefined) {
    if (ts1 === undefined) {
      if (ts2 === undefined) {
        return true
      } else {
        return false
      }
    } else {
      if (ts2 === undefined) {
        return false
      } else {
        if (ts1.length !== ts2.length) {
          return false
        }
        for (const o1 of ts1) {
          const i = ts2.findIndex((o2) => eq(o1, o2))
          if (i === -1) return false
        }
        return true
      }
    }
  }

  commandDefsEq(cs1: CommandDef[], cs2: CommandDef[]): boolean {
    return this.listEq((a, b) => this.commandDefEq(a, b), cs1, cs2)
  }

  commandDefEq(c1: CommandDef, c2: CommandDef): boolean {
    const optionsEqual = this.optionDefsEq(c1.options, c2.options)
    return (c1.name === c2.name
      && c1.description === c2.description
      && optionsEqual)
  }

  optionDefsEq(os1: OptionDef[] | undefined, os2: OptionDef[] | undefined): boolean {
    return this.listEq((o1, o2) => this.optionDefEq(o1, o2), os1, os2)
  }

  optionDefEq(o1: OptionDef, o2: OptionDef): boolean {
    return (o1.name === o2.name
      && o1.description === o2.description
      && o1.type === o2.type)
  }

  async getCommands(): Promise<CommandDef[]> {
    const response = (await this.rest.get(this.commandsRoute as `/${string}`)) as any[]
    return this.deserializeAll(response)
  }

  async putCommands(defs: CommandDef[]): Promise<unknown> {
    return await this.rest.put(
      this.commandsRoute as `/${string}`, {
      body: this.serializeAll(defs)
    })
  }

  private serializeAll(defs: CommandDef[]) {
    return defs.map(this.serialize)
  }

  private serialize(commandDef: CommandDef) {
    return {
      ...commandDef,
      type: commandDef.type ? commandTypeValues[commandDef.type] : undefined,
      options: commandDef.options?.map(o => ({
        ...o,
        type: o.type ? optionTypeValues[o.type] : undefined
      }))
    }
  }
  
  private deserializeAll(defs: any[]): CommandDef[] {
    return defs.map(this.deserialize)
  }

  private deserialize(commandDef: any): CommandDef {
    return {
      ...commandDef,
      type: commandDef.type ? commandValueTypes[commandDef.type] : undefined,
      options: commandDef.options?.map((o: any) => ({
        ...o,
        type: o.type ? optionValueTypes[o.type] : undefined
      }))
    }
  }
}
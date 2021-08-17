import * as npmlog from 'npmlog'

const ENV = process.env['NODE_ENV']
const DEBUG = ENV !== 'production'

type NpmLogger = (prefix: string, message: string, ...args: any[]) => void

npmlog.default.level = DEBUG ? 'verbose' : 'error'

class TaggedLogger {
  private tag: string

  constructor(tag: string = '') {
    this.tag = tag
  }

  private buildLogger(logger: NpmLogger) {
    return (message: string, ...args: any[]) => {
      logger(this.tag, message, ...args)
    }
  }

  // GENERAL LOG LEVELS
  v = this.buildLogger(npmlog.verbose)
  i = this.buildLogger(npmlog.info)
  w = this.buildLogger(npmlog.warn)
  e = this.buildLogger(npmlog.error)

  // SPECIAL LOG LEVELS
  silly = this.buildLogger(npmlog.silly)
  http = this.buildLogger(npmlog.http)

  // TAGGING
  static tag(tag: string): TaggedLogger {
    return new TaggedLogger(tag)
  }
}

export default class L {
  private static _defaultLogger = new TaggedLogger()

  // GENERAL LOG LEVELS
  static v = L._defaultLogger.v
  static i = L._defaultLogger.i
  static w = L._defaultLogger.w
  static e = L._defaultLogger.e

  // SPECIAL LOG LEVELS
  static silly = L._defaultLogger.silly
  static http = L._defaultLogger.http

  static tag = TaggedLogger.tag
}

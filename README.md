
## Overview

To build bots with this framework, here's the basic process.

1. Initialize and configure `Dissonance` 
2. Define some `CommandPlugins`
3. Register your `CommandPlugins` with `Dissonance`

## CommandPlugins

`CommandPlugins` are abstract classes that you can extend that provide you with lifecycle methods to simplify command handling. By default, a `CommandPlugin` can handle either message commands or application commands (slash commands).

### Plugin Lifecycle

1. attach
2. start
3. validateCommand
4. **parseArgs (required)**
5. validateArgs
6. **handle (required)**
7. cleanup

## Run the example

Create a new Discord application, set up the bot, and invite it to your testing server. Set the following environment variables.

| Variable | Description |
| - | - |
| `DISCORD_TOKEN` | The bot token |
| `DISCORD_APPLICATION_ID` | The bot application's application id |

```bash
yarn
yarn example
```
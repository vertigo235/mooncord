const logSymbols = require('log-symbols')
const { SlashCommand, CommandOptionType } = require('slash-create')

const discordClient = require('../../clients/discordClient')
const moonrakerClient = require('../../clients/moonrakerClient')
const locale = require('../../utils/localeUtil')
const permission = require('../../utils/permissionUtil')

const messageLocale = locale.commands.execute
const syntaxLocale = locale.syntaxlocale.commands.execute

let commandFeedback
let connection

let lastid = 0

module.exports = class ExecuteCommand extends SlashCommand {
    constructor(creator) {
        console.log('  Load Execute Command'.commandload)
        super(creator, {
            name: syntaxLocale.command,
            description: messageLocale.description,
            options: [{
                type: CommandOptionType.STRING,
                name: syntaxLocale.options.gcode.name,
                description: messageLocale.options.gcode.description,
                required: true
            }]
        })
        this.filePath = __filename
    }

    async run(ctx) {
        if (!await permission.hasAdmin(ctx.user, ctx.guildID, discordClient.getClient)) {
            return locale.getAdminOnlyError(ctx.user.username)
        }
        if (typeof (commandFeedback) !== 'undefined') {
            return locale.getCommandNotReadyError(ctx.user.username)
        }
    
        const gcode = ctx.options[syntaxLocale.options.gcode.name]
        const id = Math.floor(Math.random() * Number.parseInt('10_000')) + 1
        connection = moonrakerClient.getConnection()

        let timeout = 0

        commandFeedback = undefined

        ctx.defer(false)

        const gcodeHandler = handler

        connection.on('message', gcodeHandler)
        connection.send(`{"jsonrpc": "2.0", "method": "printer.gcode.script", "params": {"script": "${gcode}"}, "id": ${id}}`)
        const feedbackInterval = setInterval(() => {
            if (typeof (commandFeedback) !== 'undefined') {
                if( lastid === id ) { return }
                lastid = id
                connection.removeListener('message', gcodeHandler)
                ctx.send({
                    content: commandFeedback
                })
                commandFeedback = undefined
                lastid = 0
                clearInterval(feedbackInterval)
            }
            if (timeout === 4) {
                commandFeedback = undefined
                ctx.send({
                    content: locale.errors.command_timeout
                })
                clearInterval(feedbackInterval)
                connection.removeListener('message', gcodeHandler)
            }
            timeout++
        }, 500)
    }

    onError(error, ctx) {
        console.log(logSymbols.error, `Execute Command: ${error}`.error)
        ctx.send(locale.errors.command_failed)
        connection.removeListener('message', handler)
        commandFeedback = undefined
    }

    onUnload() {
        return 'okay'
    }
}

function handler (message) {
  const messageJson = JSON.parse(message.utf8Data)
    if (messageJson.method === 'notify_gcode_response') {
        let command = ''
        if (messageJson.params[0].includes('Unknown command')) {
            command = messageJson.params[0].replace('// Unknown command:', '').replace(/"/g, '')
            commandFeedback = messageLocale.answer.unknown.replace(/(\${gcode_feedback})/g, command)
        } else if (messageJson.params[0].includes('Error')) {
            command = messageJson.params[0].replace('!! Error on ', '').replace(/\\/g, '')
            commandFeedback = messageLocale.answer.error.replace(/(\${gcode_feedback})/g, command)
        } else {
            commandFeedback = messageLocale.answer.success
        }
    }
}
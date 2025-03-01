const args = process.argv.slice(2)

const logSymbols = require('log-symbols')
const { SlashCommand } = require('slash-create')

const locale = require('../../utils/localeUtil')
const timelapseUtil = require('../../utils/timelapseUtil')
const variablesUtil = require('../../utils/variablesUtil')

const messageLocale = locale.dynamic_commands.timelapse
const syntaxLocale = locale.syntaxlocale.dynamic_commands.timelapse

const config = require(`${args[0]}/mooncord.json`)

module.exports = class HelloCommand extends SlashCommand {
    constructor(creator) {
        console.log('  Load Timelapse Command'.commandload)
        let guildId
        if (!config.timelapse.enable) {
            guildId = '000000000000000000'
        }
        super(creator, {
            name: syntaxLocale.command,
            description: messageLocale.description,
            guildIDs: guildId
        })
    }

    async run(ctx) {
        ctx.defer(false)

        if (variablesUtil.getLastPrintJob() === '') {
            return locale.errors.no_timelapse
        }

        const timelapseEmbed = timelapseUtil.getEmbed()

        const timelapse = timelapseEmbed.files[0]

        const files = {
            name: timelapse.name,
            file: timelapse.attachment
        }

        await ctx.send({
            embeds: [timelapseEmbed.toJSON()],
            file: files
        })
    }

    onError(error, ctx) {
        console.log(logSymbols.error, `Timelapse Command: ${error}`.error)
        ctx.send(locale.errors.command_failed)
    }

    onUnload() {
        return 'okay'
    }
}
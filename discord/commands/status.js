const logSymbols = require('log-symbols')
const { SlashCommand } = require('slash-create')

const locale = require('../../utils/localeUtil')
const statusUtil = require('../../utils/statusUtil')

const messageLocale = locale.commands.status
const syntaxLocale = locale.syntaxlocale.commands.status

module.exports = class StatusCommand extends SlashCommand {
    constructor(creator) {
        console.log('  Load Status Command'.commandload)
        super(creator, {
            name: syntaxLocale.command,
            description: messageLocale.description
        })
        this.filePath = __filename
    }

    async run(ctx) {
        ctx.defer(false)

        const status = await statusUtil.getManualStatusEmbed(ctx.user)

        const statusfiles = status.files

        const files = []

        for (const statusfileindex in statusfiles) {
            const statusfile = statusfiles[statusfileindex]
            files.push({
                name: statusfile.name,
                file: statusfile.attachment
            })
        }

        await ctx.send({
            file: files,
            embeds: [status.toJSON()]
        })
    }

    onError(error, ctx) {
        console.log(logSymbols.error, `Status Command: ${error}`.error)
        ctx.send(locale.errors.command_failed)
    }

    onUnload() {
        return 'okay'
    }
}
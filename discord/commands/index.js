const emergencyStop = require('./emergencyStop')

module.exports.addCommandEvents = async (discordClient) => { await loadSlashCommands(discordClient) }
module.exports.loadSlashCommands = (discordClient) => {}

async function loadSlashCommands(discordClient) {
    const commands = []
    commands.push(emergencyStop.command)
    console.log(await discordClient.application?.commands.set(commands))
}
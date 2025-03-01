const Discord = require('discord.js')
const path = require('path')

const status = require('../utils/statusUtil')
const timelapseUtil = require('../utils/timelapseUtil')
const variables = require('../utils/variablesUtil')

const event = (message, connection, discordClient, database) => {
  if (message.type !== 'utf8') { return }

  const messageJson = JSON.parse(message.utf8Data)
  const methode = messageJson.method
  
  if (typeof (methode) !== 'undefined' && methode === 'notify_gcode_response') {
    const { params } = messageJson
    if(params[0].startsWith("mooncord.broadcast")) {
      const message = params[0].replace("mooncord.broadcast ", "")
      const broadcastembed = new Discord.MessageEmbed()
        .setColor('#03f4fc')
        .setTitle('Message')
        .attachFiles(path.resolve(__dirname, '../images/notification.png'))
        .setThumbnail('attachment://notification.png')
        .setTimestamp()
        .setDescription(message)
      status.postBroadcastMessage(broadcastembed, discordClient, database)
    }
    if(params[0].startsWith("mooncord.invite")) {
      const id = Math.floor(Math.random() * Number.parseInt('10_000')) + 1
      connection.send(`{"jsonrpc": "2.0", "method": "printer.gcode.script", "params": {"script": "RESPOND PREFIX=mooncord.response MSG=${variables.getInviteUrl()}"}, "id": ${id}}`)
    }
    if (params[0].startsWith("timelapse photo")) {
      timelapseUtil.makeFrame()
    }
  }
}
module.exports = event

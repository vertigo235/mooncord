const args = process.argv.slice(2)

const locale = require('../utils/localeUtil')
const statusUtil = require('../utils/statusUtil')
const variables = require('../utils/variablesUtil')

const config = require(`${args[0]}/mooncord.json`)

const event = (message, connection, discordClient) => {
  if (message.type !== 'utf8') { return }

  const messageJson = JSON.parse(message.utf8Data)
  const { result } = messageJson

  if (typeof (result) === 'undefined') { return }
  if (typeof (result.status) === 'undefined') { return }
  if (typeof (result.status.display_status) === 'undefined') { return }

  const {progress} = result.status.display_status

  variables.updateTimeData('file_total_duration', variables.getTimes().duration / progress)

  postProgress(discordClient, (progress * 100).toFixed(0))
  
  variables.setProgress((progress * 100).toFixed(0))
}

function postProgress(discordClient, progress) {
  if (variables.getProgress() === progress) { return }
  
  if (statusUtil.getStatus() !== 'printing') { return }
  
  discordClient.user.setActivity(
    locale.status.printing.activity.replace(/(\${value_print_progress})/g, progress)
    , { type: 'WATCHING' })

  if (config.status.update_interval &&
    progress % config.status.update_interval === 0 &&
    progress !== 0) {
      statusUtil.changeStatus(discordClient, 'printing')
  }
}
module.exports = event

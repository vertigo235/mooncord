const printJobStart = require('./printJobStart')
const printList = require('./printList')
const upload = require('./upload')

const enableEvent = function (discordClient) {
  upload(discordClient)
  printJobStart(discordClient)
  printList(discordClient)
}
module.exports = enableEvent
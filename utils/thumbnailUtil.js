const args = process.argv.slice(2)

const statusconfig = require(`${args[0]}/mooncord.json`)

const variables = require('./variablesUtil')

const Discord = require('discord.js')
const fs = require('fs').promises
const axios = require('axios')
const path = require('path')

async function retrieveThumbnail (url) {
  let thumbnail

  await getBase64(`${statusconfig.connection.moonraker_url}/server/files/gcodes/${url}`)
    .then((buffer) => {
      thumbnail = buffer
    })
    .catch(() => {
      
    })

  if (typeof (thumbnail) === 'undefined' || thumbnail === '') {
    return new Discord.MessageAttachment(await fs.readFile(path.resolve(__dirname, '../images/thumbnail_not_found.png')), 'thumbnail_not_found.png')
  }
  
  const buffer = Buffer.from(thumbnail, 'base64')
  return new Discord.MessageAttachment(buffer, 'thumbnail.png')
}

function getBase64(url) {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

module.exports.retrieveThumbnail = async function () {
  return await retrieveThumbnail(variables.getThumbnailPath())
}
module.exports.buildThumbnail = async function (path) {
  return await retrieveThumbnail(path)
}

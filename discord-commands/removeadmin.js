const config = require('../../config.json');
const discordDatabase = require('../discorddatabase')
const command = "removeadmin"
var executeCommand = (function(command,channel,user,guild,discordClient){
    var database = discordDatabase.getGuildDatabase(guild)
    var args = command.split(" ")
    args.shift()
    if(args.length==0){
        channel.send("<@"+user.id+"> Missing Arguments! Usage:\n> "+config.prefix+command+" <RoleAsTag/UserAsTag>")
        return;
    }
    if(args[0].startsWith("<@&")){
        var roleid = args[0].replace("<@&","").replace(">","")
        if(typeof guild.roles.cache.get(roleid) == "undefined"){
            channel.send("<@"+user.id+"> Invalid Role!")
            return
        }
        if(!database.adminroles.includes(roleid)){
            channel.send("<@"+user.id+"> the Role "+args[0]+" is not a Admin Role!")
            return;
        }
        const index = database.adminroles.indexOf(roleid)
        if(index > -1){
            database.adminroles.splice(index,1)
        }
        discordDatabase.updateDatabase(database,guild)
        channel.send("<@"+user.id+"> removed the Role "+args[0]+" to the Admin Roles!")
        
        return;
    }
    if(args[0].startsWith("<@")||args[0].startsWith("<@!")){
        var memberid = args[0].replace("<@!","").replace("<@","").replace(">","")
        if(typeof guild.members.cache.get(memberid) == "undefined"){
            channel.send("<@"+user.id+"> Invalid Member!")
            return
        }
        if(!database.adminusers.includes(memberid)){
            channel.send("<@"+user.id+"> the Member "+args[0]+" is not a Admin!")
            return;
        }
        const index = database.adminusers.indexOf(memberid)
        if(index > -1){
            database.adminusers.splice(index,1)
        }
        discordDatabase.updateDatabase(database,guild)
        channel.send("<@"+user.id+"> the Member "+args[0]+" is no longer a Admin!")
        
        return;
    }
    channel.send("<@"+user.id+"> Invalid Arguments! Usage:\n> "+config.prefix+command+" <RoleAsTag/UserAsTag>")
    
})
module.exports = executeCommand;
module.exports.getCommand = function(){return command}
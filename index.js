const Discord = require("discord.js");
const db = require('quick.db');
const config = require("./config.json");
const client = new Discord.Client();
const newUsers = new Discord.Collection();
//0⃣ 1⃣ 2⃣ 3⃣ 4⃣ 5⃣ 6⃣ 7⃣ 8⃣ 9⃣ 🔟 I'll need this sometime

client.on('ready', () => {
  let users = 0;
  client.guilds.map(g => users += g.memberCount);
  client.user.setActivity('' + users.toLocaleString() + " Users", {type: 'WATCHING'});
});

client.on("guildCreate", guild => {
  let users = 0;
  client.guilds.map(g => users += g.memberCount);
  client.user.setActivity('' + users.toLocaleString() + " Users", {type: 'WATCHING'});
});

client.on("guildDelete", guild => {
  let users = 0;
  client.guilds.map(g => users += g.memberCount);
  client.user.setActivity('' + users.toLocaleString() + " Users", {type: 'WATCHING'});
});

client.on('guildMemberRemove', member => {
  db.set(`roles_${member.id}`, member._roles)
  let replies = [`Looks like ${member.user} has left **${member.guild.name}**, bye bye.`, `Uh oh ${member.user} has escaped from **${member.guild.name}**, after them now!`, `${member.user} has gone away from **${member.guild.name}**.`]
  let result = Math.floor((Math.random() * replies.length));
  client.channels.get("433348180428455946").send(replies[result])
});

client.on('guildMemberAdd', async member => {
  let fetched = await db.fetch(`roles_${member.id}`);
  let replies = [`Looks like this is your first time here ${member.user} at **${member.guild.name}**, welcome to the server!`, `Welcome ${member.user} to **${member.guild.name}**!`, `Hello there ${member.user}, welcome to **${member.guild.name}**!`]
  let result = Math.floor((Math.random() * replies.length));
  let replies1 = [`Welcome back to **${member.guild.name}** ${member.user}!`, `Hey is it just me or is ${member.user}'s face similar? Oh well welcome to **${member.guild.name}**!`, `I've seen you before ${member.user}, welcome back to **${member.guild.name}**!`]
  let result1 = Math.floor((Math.random() * replies1.length));
  if (!fetched) {
    client.channels.get("433348180428455946").send(replies[result])
    console.error;
  }
  else if (fetched) {
    member.addRoles(fetched)
    client.channels.get("433348180428455946").send(replies1[result])
    console.error;
  }
});

client.on("message", async message => {

  if(message.author.bot) return;

  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "help") {
    const embed = new Discord.RichEmbed()
      .setColor('277ECD')
      .setTitle('Seeker Help')
      .addField('Commands:', "React with :one:", true)
      .addField('Settings:', "React with :two:", true)
      .addField('Info:', "React with :three:", true);
    message.channel.send(embed).then(async function (message) {
    message.react('1⃣').then(() => message.react('2⃣').then(() => message.react('3⃣')))
    console.error;
      })
    const filter = (reaction, user) => {
    return ['1⃣', '2⃣', '3⃣'].includes(reaction.emoji.name) && user.id === message.author.id
    console.error;
      };
    message.awaitReactions(filter, { time: 60000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();
        if (reaction.emoji.name === '1⃣') {
          const embed = new Discord.RichEmbed()
            .setColor('277ECD')
            .setTitle('Seeker Help')
            .addField('Commands:', "React with :one:", true)
            .addField('Settings:', "React with :two:", true)
            .addField('Info:', "React with :three:", true);
            message.clearReactions()
            message.edit(command)
            console.error;
        }
        if (reaction.emoji.name === '2⃣') {
            message.reply('you reacted with a thusmbs up.')
            console.error;
        }
        if (reaction.emoji.name === '3⃣') {
            message.reply('you reacted with a thumdbs up.')
            console.error;
        }
    })
      .catch(collected => {
        message.reply('You didn\'t react to the message within the time period.')
        console.error;
    });
  }
  if(command === "stats") {
    let servers = client.guilds.size;
    let users = 0;
    let channels = client.channels.size;
    client.guilds.map(g => users += g.memberCount);
    const embed = new Discord.RichEmbed()
        .setColor('277ECD')
        .setTitle('Seeker Statistics')
        .addField('Servers', servers.toLocaleString(), true)
        .addField('Users', users.toLocaleString(), true)
        .addField('Channels', channels.toLocaleString(), true);
    message.channel.send(embed);
  }
});

client.login(process.env.TOKEN);
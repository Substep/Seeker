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
  db.set(`settings_${guild.id}`, { join: 'Looks like this is your first time here ${member.user} at **${member.guild.name}**, welcome to the server!, Welcome ${member.user} to **${member.guild.name}**!, Hello there ${member.user}, welcome to **${member.guild.name}**!'})
  db.set(`settings_${guild.id}`, { joined: 'Welcome back to **${member.guild.name}** ${member.user}!, Hey is it just me or is ${member.user}\'s face similar? Oh well welcome to **${member.guild.name}**!, I\'ve seen you before ${member.user}, welcome back to **${member.guild.name}**!'})
  db.set(`settings_${guild.id}`, { leave: 'Looks like ${member.user} has left **${member.guild.name}**, bye bye., Uh oh ${member.user} has escaped from **${member.guild.name}**, after them now!, ${member.user} has gone away from **${member.guild.name}**.'})
  db.set(`settings_${guild.id}`, { prefix: '+'})
  let users = 0;
  client.guilds.map(g => users += g.memberCount);
  client.user.setActivity('' + users.toLocaleString() + " Users", {type: 'WATCHING'});
});

client.on("guildDelete", guild => {
  db.set(`settings_${guild.id}`, { join: 'Looks like this is your first time here ${member.user} at **${member.guild.name}**, welcome to the server!|| Welcome ${member.user} to **${member.guild.name}**!|| Hello there ${member.user}, welcome to **${member.guild.name}**!'})
  db.set(`settings_${guild.id}`, { joined: 'Welcome back to **${member.guild.name}** ${member.user}!|| Hey is it just me or is ${member.user}\'s face similar? Oh well welcome to **${member.guild.name}**!|| I\'ve seen you before ${member.user}, welcome back to **${member.guild.name}**!'})
  db.set(`settings_${guild.id}`, { leave: 'Looks like ${member.user} has left **${member.guild.name}**, bye bye.|| Uh oh ${member.user} has escaped from **${member.guild.name}**, after them now!|| ${member.user} has gone away from **${member.guild.name}**.'})
  db.set(`settings_${guild.id}`, { prefix: '+'})
  let users = 0;
  client.guilds.map(g => users += g.memberCount);
  client.user.setActivity('' + users.toLocaleString() + " Users", {type: 'WATCHING'});
});

client.on('guildMemberRemove', async member => {
  db.set(`roles_${member.id}`, member._roles)
  let servleave = await db.fetch(`settings_${member.guild.id}`, { target: '.leave' });
  let replies = [servleave]
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
  let servleave = await db.fetch(`settings_${message.guild.id}`, { target: '.leave' });
  let servprefix = await db.fetch(`settings_${message.guild.id}`, { target: '.prefix' });
  const clean = text => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
  const args = message.content.split(" ").slice(1);

  if (message.content.startsWith(servprefix + "eval")) {
    if(message.author.id !== config.ownerID) return;
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
});

client.on("message", async message => {
  
  let servprefix = await db.fetch(`settings_${message.guild.id}`, { target: '.prefix' });

  if(message.author.bot) return;
  
  if (message.channel.type === "dm") return

  if(message.content.indexOf(servprefix) !== 0) return;

  const args = message.content.slice(servprefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "help") {
    const embed = new Discord.RichEmbed()
      .setColor('277ECD')
      .setTitle('Seeker Help')
      .addField('Commands:', "React with :one:", true)
      .addField('Settings:', "React with :two:", true)
      .addField('Info:', "React with :three:", true);
    const botmessage = await message.channel.send(embed);
    await botmessage.react(`1⃣`);
    await botmessage.react(`2⃣`);
    await botmessage.react(`3⃣`);
    const filter = (reaction, user) => {
    return ['1⃣', '2⃣', '3⃣'].includes(reaction.emoji.name) && user.id === message.author.id
      };
    botmessage.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
      .then(collected => {
        const userreaction = collected.first();
        if (userreaction.emoji.name === '1⃣') {
          const command = new Discord.RichEmbed()
            .setColor('277ECD')
            .setTitle('Seeker Commands')
            .addField(`${servprefix}help`, "Shows help categories", true)
            .addField(`${servprefix}ping`, "Checks your ping", true)
            .addField(`${servprefix}stats`, "Shows stats of the bot", true)
            .addField(`${servprefix}prefix`, "Changes prefix of bot", true);
            botmessage.delete()
            const commandmessage = message.channel.send(command)
            }
        if (userreaction.emoji.name === '2⃣') {
          const settings = new Discord.RichEmbed()
            .setColor('277ECD')
            .setTitle('Seeker Settings')
            .addField('Prefix', servprefix, true)
            .addField('${servprefix}ping', "Checks your ping", true)
            .addField('${servprefix}stats', "Shows stats of the bot", true);
            botmessage.delete()
            const settingsmessage = message.channel.send(settings)
        }
        if (userreaction.emoji.name === '3⃣') {
          const info = new Discord.RichEmbed()
            .setColor('277ECD')
            .setTitle('Seeker Information')
            .addField('Created by', 'Substep#0557', true)
            .addField('Created on', '6/27/18', true)
            botmessage.delete()
            const infomessage = message.channel.send(info)
        }
        })
      .catch(collected => {
        message.delete()
        botmessage.delete()
        message.reply('You didn\'t react to the message within the time period.').then(message => {
        message.delete(10000)
  });
    });
  }
  if(command === "ping") {
    const m = await message.channel.send('🏓 Ping? <a:discordloading:439643878803505162>');
    m.edit(`🏓 Pong! (Roundtrip: ${m.createdTimestamp - message.createdTimestamp}ms | One-way: ${~~client.ping}ms)`);
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
  if(command === "prefix") {
    if (!message.member.hasPermission("MANAGE_SERVER")) return message.reply('you don\'t have permission to change server prefix');
    if (!args.join(' ')) return message.reply('you need to specify a prefix.')
    let newprefix = message.content.split(" ").slice(1, 2)[0];
    db.set(`settings_${message.guild.id}`, { prefix: newprefix})
    message.reply((`this server's prefix has been changed to \`${servprefix}\`.`));
  }
});

client.login(process.env.TOKEN);
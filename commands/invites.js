const fs = require("fs");
const path = require("path");

const inviteDataPath = path.join(__dirname, "../invited_data.json");

module.exports = {
  name: "invites",
  description: "Show how many users a member has invited",
  execute(message, args) {
    const targetUser =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    if (!targetUser) {
      return message.reply("User not found.");
    }

    const userID = targetUser.id;

    // Load invite data
    let inviteData = {};
    if (fs.existsSync(inviteDataPath)) {
      const data = fs.readFileSync(inviteDataPath, "utf8");
      if (data.trim()) {
        inviteData = JSON.parse(data);
      }
    }

    // Determine invites count
    const invites = inviteData[userID] ? inviteData[userID].invited.length : 0;

    // Send text response
    message.channel.send(
      `${targetUser.user.tag} has invited a total of ${invites} users.`
    );
  },
};

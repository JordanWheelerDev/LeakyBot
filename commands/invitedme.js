const fs = require("fs");
const path = require("path");

const inviteDataPath = path.join(__dirname, "../invited_data.json");

module.exports = {
  name: "invitedme",
  description: "Store who invited the user",
  execute(message, args) {
    const inviter = message.mentions.members.first();

    if (!inviter) {
      return message.reply("Please mention the user who invited you.");
    }

    const invitedUserID = message.author.id;
    const inviterUserID = inviter.id;

    // Load invite data
    let inviteData = {};
    if (fs.existsSync(inviteDataPath)) {
      const data = fs.readFileSync(inviteDataPath, "utf8");
      if (data.trim()) {
        inviteData = JSON.parse(data);
      }
    }

    // Check if invited user is already recorded by any inviter
    let alreadyInvitedBy = null;
    for (const inviterID in inviteData) {
      if (inviteData[inviterID].invited.includes(invitedUserID)) {
        alreadyInvitedBy = inviterID;
        break;
      }
    }

    // If already invited by another user, inform the user
    if (alreadyInvitedBy) {
      const inviterName =
        message.guild.members.cache.get(alreadyInvitedBy)?.user.tag ||
        "Unknown User";
      return message.reply(`You have already been invited by ${inviterName}.`);
    }

    // Update invite relationship
    if (!inviteData[inviterUserID]) {
      inviteData[inviterUserID] = { invited: [] };
    }

    // Add invited user if not already recorded
    if (!inviteData[inviterUserID].invited.includes(invitedUserID)) {
      inviteData[inviterUserID].invited.push(invitedUserID);
    }

    // Save invite data back to file
    fs.writeFileSync(inviteDataPath, JSON.stringify(inviteData, null, 2));

    message.reply(
      `Thank you for letting us know! ${inviter.user.tag} invited you.`
    );
  },
};

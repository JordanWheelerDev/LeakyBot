const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
  name: "premium",
  description: "Create a new premium purchase ticket",
  async execute(message, args) {
    try {
      const guild = await message.guild.fetch();

      // Define the ticket category ID
      const ticketCategoryId = "1257343632986476554"; // Replace with your actual category ID

      // Fetch the ticket category
      const ticketCategory = guild.channels.cache.get(ticketCategoryId);

      // Check if the ticket category exists
      if (!ticketCategory || ticketCategory.type !== "GUILD_CATEGORY") {
        return message.reply(
          "The ticket category does not exist or is invalid. Please contact an administrator."
        );
      }

      // Check if the user already has a ticket open
      const existingTicket = guild.channels.cache.find(
        (channel) =>
          channel.name === `syn-${message.author.id}` &&
          channel.parentId === ticketCategoryId && // Check against category ID
          channel.type === "GUILD_TEXT"
      );

      if (existingTicket) {
        return message.reply("You already have an open ticket.");
      }

      // Create a new channel for the ticket
      const ticketChannel = await guild.channels.create(
        `ticket-${message.author.id}`,
        {
          type: "GUILD_TEXT",
          parent: ticketCategoryId, // Use category ID directly
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [Permissions.FLAGS.VIEW_CHANNEL],
            },
            {
              id: message.author.id,
              allow: [
                Permissions.FLAGS.VIEW_CHANNEL,
                Permissions.FLAGS.SEND_MESSAGES,
                Permissions.FLAGS.READ_MESSAGE_HISTORY,
              ],
            },
          ],
        }
      );

      // Send a welcome message in the ticket channel
      const welcomeEmbed = new MessageEmbed()
        .setTitle("Premium Purchase Ticket Created")
        .setDescription(
          `Hello ${message.author}, welcome to your premium purchase ticket! Staff will be with you shortly.`
        )
        .setColor("#34cceb");

      await ticketChannel.send({ embeds: [welcomeEmbed] });
    } catch (error) {
      console.error("Error creating ticket:", error);
      message.reply(
        "There was an error creating your ticket. Please try again later."
      );
    }
  },
};

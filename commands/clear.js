module.exports = {
  name: "clear",
  description: "Clear a specified number of messages",
  async execute(message, args) {
    // Check if the user has the required permissions
    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
      return message.reply(
        "You do not have the permission to manage messages."
      );
    }

    // Check if a number of messages to delete is provided
    const amount = parseInt(args[0]);

    if (isNaN(amount)) {
      return message.reply(
        "Please provide a valid number of messages to delete."
      );
    }

    if (amount < 1 || amount > 100) {
      return message.reply("You need to input a number between 1 and 100.");
    }

    // Fetch and delete the messages
    try {
      const messages = await message.channel.bulkDelete(amount, true);
      message.channel
        .send(`Successfully deleted ${messages.size} messages.`)
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000); // Delete the confirmation message after 5 seconds
        });
    } catch (error) {
      console.error(error);
      message.reply(
        "There was an error trying to clear messages in this channel!"
      );
    }
  },
};

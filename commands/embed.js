const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "embed",
  description: "Create a customizable embed",
  async execute(message, args) {
    // Default values for the embed
    let title = "Default Title";
    let description = "Default Description";
    let color = 0x00ff00; // Default green color
    let footer = "Default Footer";
    let fields = [];

    // Parse arguments
    const argsString = args.join(" ");
    const argsArray = argsString.split(";");

    argsArray.forEach((arg) => {
      const [key, value] = arg.split("=").map((s) => s.trim());
      switch (key.toLowerCase()) {
        case "title":
          title = value || title;
          break;
        case "description":
          description = value || description;
          break;
        case "color":
          color = parseInt(value.replace("#", ""), 16) || color;
          break;
        case "footer":
          footer = value || footer;
          break;
        case "field":
          const [fieldName, fieldValue] = value.split(",").map((s) => s.trim());
          if (fieldName && fieldValue) {
            fields.push({ name: fieldName, value: fieldValue });
          }
          break;
        default:
          break;
      }
    });

    // Delete the command message
    try {
      await message.delete();
    } catch (error) {
      console.error("Failed to delete the command message:", error);
    }

    // Create the embed
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .addFields(fields)
      .setFooter({ text: footer });

    // Send the embed
    await message.channel.send({ embeds: [embed] });
  },
};

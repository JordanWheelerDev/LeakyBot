const { Client, GatewayIntentBits, Collection } = require("discord.js");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // Include GuildMembers intent for member tracking
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Load invite data from file if it exists
let inviteData = {};
const inviteDataPath = path.join(__dirname, "invite_data.json");

if (fs.existsSync(inviteDataPath)) {
  const data = fs.readFileSync(inviteDataPath, "utf8");
  if (data.trim()) {
    // Check if data is not empty
    inviteData = JSON.parse(data);
  }
}

// Save invite data to file function
function saveInviteData() {
  fs.writeFileSync(inviteDataPath, JSON.stringify(inviteData, null, 2), "utf8");
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!") || message.author.bot) return;

  const args = message.content.slice(1).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error executing that command.");
  }
});

// Handle new member joining
client.on("guildMemberAdd", async (member) => {
  // Send a basic welcome message to the new member
  const welcomeChannel = member.guild.systemChannel; // Change to your desired welcome channel if needed
  if (!welcomeChannel) return; // Return if no system channel is found

  // Send a simple welcome message
  const welcomeMessage = `Welcome to SYN Leaks, ${member.displayName}! We're glad to have you here.`;
  welcomeChannel.send(welcomeMessage);

  // Assign a role to the new member
  const roleName = "Basic Bitch"; // Change to your desired role name
  const role = member.guild.roles.cache.find((r) => r.name === roleName);

  if (role) {
    try {
      await member.roles.add(role);
      console.log(`Assigned role "${roleName}" to ${member.user.tag}`);
    } catch (error) {
      console.error(`Failed to assign role "${roleName}":`, error);
    }
  } else {
    console.error(`Role "${roleName}" not found.`);
  }
});

client.login(process.env.BOT_TOKEN);

process.on("SIGINT", () => {
  saveInviteData(); // Save invite data before exiting
  process.exit();
});

process.on("beforeExit", () => {
  saveInviteData(); // Save invite data before exiting
});

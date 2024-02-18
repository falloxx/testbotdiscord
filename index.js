const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("**")) {
    const nomFilm = message.content.substring(2);
    const dataFilm = await fetchMovie(nomFilm);
    sendEmbed(message.channel, dataFilm);
  }

  if (message.content.includes("http")) {
    message
      .delete()
      .then((msg) => {
        msg.channel.send("message supprimé");
        console.log(`Message supprimé de : ${msg.author.username}`);
      })
      .catch(console.error);
  }
});

client.login(
  "MTIwODc4Mjg1ODE3NzQ4NjkyOQ.GvOdW-._MZnlePn-rwDDCLWXbUyNEgxI4TG_WbSnG3xp0"
);

const apiKey = "b7f3e399a51c75a192171090ffeeea8e";

async function fetchMovie(query) {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=fr-FR`
  )
    .then((res) => res.json())
    .then((json) => json?.results?.[0]);
}

function sendEmbed(channel, dataFilm) {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(dataFilm.title)
    .setDescription(dataFilm.overview)
    .addFields(
      { name: "\u200B", value: "\u200B" },
      { name: "Date de sortie :", value: dataFilm.release_date, inline: true },
      {
        name: "Film pour adulte",
        value: dataFilm.adult ? "oui" : "non",
        inline: true,
      }
    )
    .setImage("https://image.tmdb.org/t/p/w500/" + dataFilm.poster_path)
    .setTimestamp();

  channel.send({ embeds: [exampleEmbed] });
}

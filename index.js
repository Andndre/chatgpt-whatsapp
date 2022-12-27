import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { ChatGPTAPIBrowser } from "chatgpt";
import { config } from "dotenv";
config();

const client = new Client();

const api = new ChatGPTAPIBrowser({
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
});

async function run() {
  await api.initSession();

  client.on("qr", (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  const room = new Map();

  client.on("message", async (msg) => {
    const id = (await msg.getChat()).id.user;
    console.log({ id });
    if (msg.body === "/chatgpt login") {
      room.set(id, true);
      msg.reply(
        "Fitur chatgpt sudah aktif. Pesan selanjutnya akan direspon oleh chatgpt"
      );
    } else if (msg.body === "/chatgpt logout") {
      room.set(id, false);
      msg.reply("Fitur chatgpt sudah dimatikan. Kembali ke mode normal");
    } else {
      if (!room.has(id)) return;
      if (!room.get(id)) return;
      const chatgpt = await api.sendMessage(msg.body);
      console.log({
        pesan: msg,
        chatgpt: chatgpt.response,
      });
      msg.reply(chatgpt.response);
    }
  });

  client.initialize();
}

run();

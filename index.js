import { Client } from "whatsapp-web.js";
import { default as qrcode } from "qrcode-terminal";
import { ChatGPTAPIBrowser } from "chatgpt";
import { config } from "dotenv";
import { ChatGPTAccounts } from "./chatGPT.js";

config();

const client = new Client();

const commandLogin = "/chatgpt login";
const commandLogout = "/chatgpt logout";

const prefixForMyself = "/chatgpt";

const chatgpt = new ChatGPTAccounts(
  new ChatGPTAPIBrowser({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  })
);

async function run() {
  const count = await chatgpt.init();

  console.log(count + " akun chatGPT berhasil login");

  client.on("qr", (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  const room = new Map();

  client.on("message_create", async (msg) => {
    const id = (await msg.getChat()).id.user;

    try {
      console.log({ id });
      if (msg.fromMe) {
        if (!msg.body.startsWith(prefixForMyself)) return;
        (await msg.getChat()).sendMessage("Sedang memproses..");
        const chatGPTResponse = await chatgpt.getBotResponse(
          msg.body.substring(8)
        );
        if (chatGPTResponse.error) {
          (await msg.getChat()).sendMessage(
            "Oopps... sepertinya terjadi kesalahan"
          );
        }

        console.log({
          pesan: msg.body,
          chatgpt: chatGPTResponse.response,
        });
        msg.reply("chatgpt:\n" + chatGPTResponse.response);
        return;
      }
      if (msg.body.toLowerCase() === commandLogin) {
        room.set(id, true);
        msg.reply(
          "Fitur chatgpt sudah aktif. Pesan selanjutnya akan direspon oleh chatgpt"
        );
      } else if (msg.body.toLowerCase() === commandLogout) {
        room.set(id, false);
        msg.reply("Fitur chatgpt sudah dimatikan. Kembali ke mode normal");
      } else {
        if (!room.has(id)) return;
        if (!room.get(id)) return;
        (await msg.getChat()).sendMessage("Sedang memproses..");
        const chatGPTResponse = await chatgpt.getBotResponse(msg.body);
        if (chatGPTResponse.error) {
          (await msg.getChat()).sendMessage(
            "Oopps... sepertinya terjadi kesalahan"
          );
        }
        console.log({
          pesan: msg.body,
          chatgpt: chatGPTResponse.response,
        });
        msg.reply(chatGPTResponse.response);
      }
    } catch (e) {
      msg.reply(e.message);
    }
  });

  client.initialize();
}

run();

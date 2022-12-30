import { Client } from "whatsapp-web.js";
import { default as qrcode } from "qrcode-terminal";
import { ChatGPTAPIBrowser } from "chatgpt";
import { config } from "dotenv";
import { ChatGPTAccounts } from "./chatGPT.js";

config();

const client = new Client();

const commandLogin = "/chatgpt login";
const commandLogout = "/chatgpt logout";

/** @type {string | undefined} */
let selfConvId = undefined;

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
    const chat = await msg.getChat();
    const id = chat.id.user;
    try {
      console.log({ id });
      if (msg.fromMe) {
        if (!msg.body.startsWith(prefixForMyself)) return;
        chat.sendStateTyping();
        const chatGPTResponse = await chatgpt.getBotResponse(
          msg.body.substring(prefixForMyself.length),
          { conversationId: selfConvId }
        );
        selfConvId = chatGPTResponse.conversationId;
        if (chatGPTResponse.error) {
          chat.sendMessage("Oopps... sepertinya terjadi kesalahan");
        }
        console.log({
          pesan: msg.body,
          chatgpt: chatGPTResponse.response,
        });
        msg.reply("chatgpt:\n" + chatGPTResponse.response);
        return;
      }
      if (msg.body.toLowerCase() === commandLogin) {
        const {
          conversationId,
          error: _,
          response,
        } = await chatgpt.getBotResponse("respon menggunakan bahasa indonesia");
        room.set(id, conversationId);
        msg.reply(
          "Fitur chatgpt sudah aktif. Pesan selanjutnya akan direspon oleh chatgpt\n" +
            "\n" +
            response
        );
      } else if (msg.body.toLowerCase() === commandLogout) {
        room.set(id, undefined);
        msg.reply("Fitur chatgpt sudah dimatikan. Kembali ke mode normal");
      } else {
        if (!room.has(id)) return;
        const conversationId = room.get(id);
        if (!conversationId) return;
        chat.sendStateTyping();
        const chatGPTResponse = await chatgpt.getBotResponse(
          msg.body,
          conversationId
        );
        if (chatGPTResponse.error) {
          chat.sendMessage("Oopps... sepertinya terjadi kesalahan");
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

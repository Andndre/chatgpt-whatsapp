import { Client } from "whatsapp-web.js";
import { default as qrcode } from "qrcode-terminal";
import { ChatGPTAPIBrowser } from "chatgpt";
import { config } from "dotenv";
import { ChatGPTAccounts } from "./chatGPT.js";

config();

const client = new Client();

const commandActivate = "/chatgpt true";
const commandDeactivate = "/chatgpt false";

const prefixForMyself = "/chatgpt";

const chatgpt = new ChatGPTAccounts(
  new ChatGPTAPIBrowser({
    email: process.env.CHAT_GPT_EMAIL,
    password: process.env.CHAT_GPT_PASSWORD,
  })
);

// This allows you to send more messages without
// getting 429 / too many request Error:
//
// chatgpt.addAccount(new ChatGPTAPIBrowser({
//   email: CHAT_GPT_EMAIL_2,
//   password: CHAT_GPT_PASSWORD_2
// }))

async function run() {
  const count = await chatgpt.init();

  console.log(count + " account(s) successfully logged in");

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
      if (msg.fromMe) {
        if (!msg.body.startsWith(prefixForMyself)) return;
        chat.sendStateTyping();
        const chatGPTResponse = await chatgpt.getBotResponse(
          msg.body.substring(prefixForMyself.length)
        );
        if (chatGPTResponse.error) {
          chat.sendMessage(
            "Something went wrong:\n" + chatGPTResponse.response
          );
        } else {
          msg.reply(chatGPTResponse.response);
        }
        console.log({
          message: msg.body,
          chatgpt: chatGPTResponse.response,
        });
        return;
      }
      if (msg.body.toLowerCase() === commandActivate) {
        room.set(id, true);
        msg.reply(
          "The chatgpt feature has been activated successfully. Further messages will be responded to by chatgpt\n" +
            "\n" +
            response
        );
      } else if (msg.body.toLowerCase() === commandDeactivate) {
        room.set(id, false);
        msg.reply(
          "The chatgpt feature has been disabled successfully. Return to normal mode"
        );
      } else {
        if (!room.has(id)) return;
        if (!room.get(id)) return;
        chat.sendStateTyping();
        const chatGPTResponse = await chatgpt.getBotResponse(msg.body);
        if (chatGPTResponse.error) {
          chat.sendMessage(
            "Something went wrong:\n" + chatGPTResponse.response
          );
        } else {
          msg.reply(chatGPTResponse.response);
        }
        console.log({
          message: msg.body,
          chatgpt: chatGPTResponse.response,
        });
      }
    } catch (e) {
      msg.reply(e.message);
    }
  });

  client.initialize();
}

run();

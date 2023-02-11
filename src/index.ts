import { Client } from "whatsapp-web.js";
import { default as qrcode } from "qrcode-terminal";
import { ChatGPTAPI } from "chatgpt";
import { config } from "dotenv";
import { handleMessage } from "./chatGPT.js";

config();

export const api = new ChatGPTAPI({
  apiKey: process.env.CHAT_GPT_API_KEY!,
});

const client = new Client({});

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message_create", async (msg) => {
  try {
    await handleMessage(msg);
  } catch (e: any) {
    msg.reply(e.message);
  }
});

client.initialize();

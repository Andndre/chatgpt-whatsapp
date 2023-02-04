import { default as WAWebJS } from "whatsapp-web.js";
import { api } from "./index.js";

type Room = {
  convId: string;
  lastMsgId: string;
};

let myConvId: string | undefined = undefined;
let myParentMsgId: string | undefined = undefined;

const rooms: Map<string, Room> = new Map();

export async function handleMessage(message: WAWebJS.Message) {
  const { command, args } = getCommand(message.body);

  switch (command) {
    case "/chatgpt":
      await commandChatGPT(message, args);
      return;
  }
  if (message.fromMe) return;
  const chat = await message.getChat();
  const room = rooms.get(chat.id.user);
  if (!room) {
    return;
  }
  const reply = await api.sendMessage(message.body, {
    conversationId: room.convId,
    parentMessageId: room.lastMsgId,
  });
  message.reply("🤖: " + reply.text);
  rooms.set(chat.id.user, {
    convId: reply.conversationId!,
    lastMsgId: reply.id,
  });
}

async function commandChatGPT(message: WAWebJS.Message, args: string[]) {
  if (message.fromMe) {
    const reply = await api.sendMessage(args.join(" "), {
      conversationId: myConvId,
      parentMessageId: myParentMsgId,
    });
    myConvId = reply.conversationId;
    myParentMsgId = reply.id;
    message.reply("🤖: " + reply.text);
    return;
  }
  const chat = await message.getChat();
  if (args[0] === "on") {
    const reply = await api.sendMessage(
      "hello, my name is " + chat.name,
    );

    rooms.set(chat.id.user, {
      convId: reply.conversationId!,
      lastMsgId: reply.id,
    });
    message.reply(
      "🤖: ChatGPT will be responded to your messages from now on...\n🤖: " +
        reply.text,
    );
  } else if (args[0] === "off") {
    message.reply("🤖: Returning to normal mode...");
    rooms.delete(chat.id.user);
  }
}

function getCommand(message: string) {
  const splt = message.split(" ");
  return { command: splt[0], args: splt.slice(1) };
}

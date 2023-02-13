# ChatGPT-Whatsapp

A WhatsApp bot that can respond to messages with the ChatGPT API 🔥

Powered by [this repo](https://github.com/transitive-bullshit/chatgpt-api)

## Getting Started

* Clone this repository
* Run `npm install`
* Change `.env.example` to `.env` and add your open AI API key
	```env
	CHAT_GPT_API_KEY=
	```
* Run bot: use `npm run start`

> According to [this](https://github.com/transitive-bullshit/chatgpt-api#:~:text=IP%20issues%20or-,rate%20limiting,-.), there is no need for us to worry about the API rate limit anymore

## How to Use the Bot
* To activate the bot for current chat room / group (Only for other WhatsApp Account)
	```
	/chatgpt on
	```
* To disable
	```
	/chatgpt off
	```
* For WhatsApp Account that running the ChatGpt Bot, you can prefix `/chatgpt` before your message
	```
	/chatgpt 1 + 1 equals what?
	```

## Known Issues

* You must keep the terminal window to stay focused for the bot to respond to messages

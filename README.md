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

* You may get this error while logging in to whatsapp:
	```
	...\node_modules\puppeteer\lib\cjs\puppeteer\common\ExecutionContext.js:221
				throw new Error('Evaluation failed: ' + helper_js_1.helper.getExceptionMessage(exceptionDetails));
					^

	Error: Evaluation failed: TypeError: Cannot read properties of undefined (reading 'LegacyPhoneFeatures')
		at __puppeteer_evaluation_script__:13:76
		at ExecutionContext._evaluateInternal (...\node_modules\puppeteer\lib\cjs\puppeteer\common\ExecutionContext.js:221:19)
		at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
		at async ExecutionContext.evaluate (...\node_modules\puppeteer\lib\cjs\puppeteer\common\ExecutionContext.js:110:16)
		at async Client.initialize (...\node_modules\whatsapp-web.js\src\Client.js:267:9)

	Node.js v18.12.1
	```

	Here is the workaround for now ([Source](https://github.com/pedroslopez/whatsapp-web.js/pull/1917)):

	Modify `Injected.js` located in the `node_modules\whatsapp-web.js\src\util` directory as follows:
	```diff
	...
	  window.Store.DownloadManager = window.mR.findModule('downloadManager')[0].downloadManager;
	- window.Store.Features = window.mR.findModule('FEATURE_CHANGE_EVENT')[0].LegacyPhoneFeatures;
	+ window.Store.Features = window.mR.findModule('FEATURE_CHANGE_EVENT')[0]?.LegacyPhoneFeatures;
	  window.Store.GroupMetadata = window.mR.findModule('GroupMetadata')[0].default.GroupMetadata;
	...
	```

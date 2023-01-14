# ChatGPT-Whatsapp

A WhatsApp bot that can respond to messages with Unofficial ChatGPT API

> **Note**
> This Bot will be migrated to use the Official ChatGPT API as soon as it released

## Getting Started

* Clone this repository
* Run `npm install`
* Change `.env.example` to `.env` and add your chatGPT account information (email and password)
	```env
	CHAT_GPT_EMAIL=
	CHAT_GPT_PASSWORD=
	```
* Add multiple account: *(Optional)*

	*index.js*:
	```js
	...
	const chatgpt = new ChatGPTAccounts(
		new ChatGPTAPIBrowser({
			email: process.env.CHAT_GPT_EMAIL,
			password: process.env.CHAT_GPT_PASSWORD,
		})
	);

	// This allows you to send more messages without 
	// getting 429 / too many request Error:

	chatgpt.addAccount(new ChatGPTAPIBrowser({
		email: process.env.CHAT_GPT_EMAIL_2, // add this to your .env too
		password: process.env.CHAT_GPT_PASSWORD_2
	}))
	...
	```
## How to Use the Bot
* To activate the bot for current chat room / group (Only for other WhatsApp Account)
	```
	/chatgpt true
	```
* To disable
	```
	/chatgpt false
	```
* For WhatsApp Account that running the ChatGpt Bot, you can prefix `/chatgpt` before your message
	```
	/chatgpt 1 + 1 equals what?
	```
* You can change the `prefix` / `command` in the `index.js` file
	```js
	...
	const commandActivate = "your own activate command";
	const commandDeactivate = "your own deactivate command";

	const prefixForMyself = "your own prefix for yourself";
	...
	```

## Known Issues

* The bot cannot remember previous conversation (for now)

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

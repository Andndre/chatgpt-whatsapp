import { ChatGPTAPIBrowser } from "chatgpt";

export class ChatGPTAccounts {
  /**
   *
   * @param {ChatGPTAPIBrowser} value
   * @param {ChatGPTAccounts | undefined} next
   */
  constructor(value, next) {
    this.value = value;
    this.lastTime = Date.now();
    this.busy = false;
    this.next = next;
  }

  /**
   *
   * @param {string} message
   *
   * @returns {Promise<{response: string, error: boolean}>} bot response
   */
  async getBotResponse(message, now = Date.now()) {
    if (this.busy || now - this.lastTime < 3333) {
      if (!this.next) {
        return {
          response:
            "This feature has been used too many times, please try again in a few seconds.",
          error: true,
        };
      }
      return this.next.getBotResponse(message, now);
    }
    let res = "";
    let error = false;
    try {
      this.lastTime = Date.now();
      this.busy = true;
      const chatResponse = await this.value.sendMessage(message);
      res = chatResponse.response;
    } catch (e) {
      res = e.message;
      error = true;
    } finally {
      this.lastTime = Date.now();
      this.busy = false;
      return { response: res, error };
    }
  }

  /**
   *
   * @param {ChatGPTAPIBrowser} account
   *
   * @returns {void}
   */
  addAccount(account) {
    if (!this.next) {
      this.next = new ChatGPTAccounts(account, undefined);
      return;
    }
    this.next.addAccount(account);
  }

  async init(count = 1) {
    await this.value.initSession();
    if (!this.next) return count;
    await new Promise((resolve) => {
      console.log(
        "Trying to login to " + (count + 1) + "th account in 3 seconds"
      );
      setTimeout(() => resolve(), 3000);
    });
    return this.next.init(count + 1);
  }
}

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
    this.next = next;
  }

  /**
   *
   * @param {string} message
   *
   * @returns {Promise<{response: string, error: boolean}>} bot response
   */
  async getBotResponse(message, now = Date.now()) {
    if (now - this.lastTime < 3333) {
      if (!this.next) {
        return {
          response:
            "Fitur ini terlalu sering digunakan, coba beberapa detik lagi",
          error: true,
        };
      }
      return this.next.getBotResponse(message, now);
    }
    this.lastTime = now;
    let res = ".";
    let error = false;
    try {
      res = (await this.value.sendMessage(message)).response;
    } catch (e) {
      res = e.message;
      error = true;
    } finally {
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
      console.log("Mencoba login akun ke " + (count + 1) + " dalam 5 detik");
      setTimeout(() => resolve(), 5000);
    });
    return this.next.init(count + 1);
  }
}

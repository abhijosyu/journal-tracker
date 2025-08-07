export default class Conversation {
  userMessages: string[];
  AIMessages: string[];

  constructor() {
    this.userMessages = [];
    this.AIMessages = [];
  }

  addUserMessage(message: string) {
    this.userMessages.push(message);
    if (this.userMessages.length > 50) {
      this.userMessages.shift();
    }
  }

  addAIMessage(message: string): void {
    this.AIMessages.push(message);
    if (this.AIMessages.length > 50) {
      this.AIMessages.shift();
    }
  }
}

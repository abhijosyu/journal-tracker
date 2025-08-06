export default class Conversation {
  userMessages: string[];
  AIMessages: string[];

  constructor() {
    this.userMessages = [];
    this.AIMessages = [];
  }

  addUserMessage(message: string) {
    this.userMessages.push(message);
  }

  addAIMessage(message: string): void {
    this.AIMessages.push(message);
  }
}

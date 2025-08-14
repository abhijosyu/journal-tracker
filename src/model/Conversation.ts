export default class Conversation {
  userMessages: string[];
  AIMessages: string[];

  constructor() {
    this.userMessages = [];
    this.AIMessages = [];
  }

  addUserMessage(message: string) {
    this.userMessages.push(message);
    console.log("UserMessages: ", this.userMessages);
  }

  addAIMessage(message: string): void {
    this.AIMessages.push(message);
    console.log("AIMessages: ", this.AIMessages);
  }
}

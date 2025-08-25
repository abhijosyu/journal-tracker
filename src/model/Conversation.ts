/**
 * represents a conversation class which stores user and AI messages
 */
export default class Conversation {
  userMessages: string[]; // the user messages
  AIMessages: string[]; // the ai messages

  constructor() {
    this.userMessages = [];
    this.AIMessages = [];
  }

  // the user message to add
  addUserMessage(message: string) {
    this.userMessages.push(message);
    console.log("UserMessages: ", this.userMessages);
  }

  // the ai message to add
  addAIMessage(message: string): void {
    this.AIMessages.push(message);
    console.log("AIMessages: ", this.AIMessages);
  }
}

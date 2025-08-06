import Conversation from "./Conversation";
import JournalEntry from "./JournalEntry";

export default class JournalCollection {
  JournalMap: Map<Number, JournalEntry>;
  JournalList: JournalEntry[];
  FilteredList: JournalEntry[];
  AIConversation: Conversation;

  constructor() {
    this.JournalMap = new Map<Number, JournalEntry>();
    this.JournalList = [];
    this.FilteredList = [];

    this.AIConversation = new Conversation();
  }

  addEntry(entry: JournalEntry): void {
    console.log("in model adding entry: " + entry);
    this.JournalMap.set(entry.ID, entry);
    this.JournalList.push(entry);
  }

  deleteEntry(id: number): void {
    this.JournalMap.delete(id);
    this.JournalList = this.JournalList.filter((e) => e.ID !== id);
    console.log("after deleting entry: ", this.JournalMap);
  }

  addUserMessageToConversation(message: string): void {
    this.AIConversation.addUserMessage(message);
  }

  addAIMessageToConversation(message: string): void {
    this.AIConversation.addAIMessage(message);
  }

  filterEntries(Date1: Date, Date2?: Date): void {
    if (Date2) {
      this.FilteredList = this.JournalList.filter(
        (e) => e.date >= Date1 && e.date <= Date2
      );
    } else {
      this.FilteredList = this.JournalList.filter((e) => e.date >= Date1);
    }
  }

  averageRating(): number {
    const ratings = this.JournalList.filter(
      (e) => e.date.getMonth() == new Date().getMonth()
    ).map((e) => e.dayRating);
    const sum = () => {
      let summation = 0;
      for (let i = 0; i < ratings.length; i++) {
        summation += ratings[i];
      }
      return summation;
    };
    const average = sum() / ratings.length;
    return average;
  }
}

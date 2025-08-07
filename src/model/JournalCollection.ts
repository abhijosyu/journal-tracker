import {
  addAIMessageToFireBase,
  addUserMessagesToFireBase,
  deleteJournalEntryFromFirebase,
  saveJournalEntryInFirebase,
} from "../firebase/JournalStorage";
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

  async addEntry(entry: JournalEntry): Promise<void> {
    console.log("in model adding entry: " + entry);
    this.ensureUniqueID(entry);
    this.JournalMap.set(entry.ID, entry);
    this.JournalList.push(entry);
    this.saveEntryToFirebase(entry);
  }

  ensureUniqueID(entry: JournalEntry): void {
    const IDList = this.JournalList.map((e) => e.ID);
    const maxID = IDList.length > 0 ? Math.max(...IDList) : 1;
    entry.ID = maxID + 1;
  }

  async deleteEntry(id: number): Promise<void> {
    this.JournalMap.delete(id);
    this.JournalList = this.JournalList.filter((e) => e.ID !== id);
    console.log("after deleting entry: ", this.JournalMap);
  }

  async editRating(entry: number, newRating: number) {
    const exists = this.JournalMap.get(entry);
    if (exists) {
      exists.editDayRating(newRating);
      this.saveEntryToFirebase(exists);
    }
  }

  async addUserMessageToConversation(message: string): Promise<void> {
    this.AIConversation.addUserMessage(message);
    this.addUserMessagesToFirebase(this.AIConversation.userMessages);
  }

  async addAIMessageToConversation(message: string): Promise<void> {
    this.AIConversation.addAIMessage(message);
    this.addAIMessagesToFirebase(this.AIConversation.AIMessages);
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

  async saveEntryToFirebase(entry: JournalEntry): Promise<void> {
    await saveJournalEntryInFirebase(entry);
  }

  async deleteEntryFromFirebase(entry: JournalEntry): Promise<void> {
    await deleteJournalEntryFromFirebase(entry);
  }

  async addAIMessagesToFirebase(messages: string[]): Promise<void> {
    await addAIMessageToFireBase(messages);
  }

  async addUserMessagesToFirebase(messages: string[]): Promise<void> {
    await addUserMessagesToFireBase(messages);
  }
}

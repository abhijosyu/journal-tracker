import {
  addAIMessageToFireBase,
  addUserMessagesToFireBase,
  deleteJournalEntryFromFirebase,
  saveJournalEntryInFirebase,
} from "../firebase/JournalStorage";
import Conversation from "./Conversation";
import JournalEntry from "./JournalEntry";

/**
 * represents a journal collection (a collection of journal entries)
 * journal collection will contain the conversation a user has with the chatbot, a map of journal entries, and a JournalList
 *
 */
export default class JournalCollection {
  JournalMap: Map<Number, JournalEntry>; // map for easy identification and access
  JournalList: JournalEntry[]; // list for easier mapping for UI
  FilteredList: JournalEntry[]; // filtered list based on user prefrences (not implemented yet)
  AIConversation: Conversation; // the chat box between user and AI

  // everything starts off blank
  constructor() {
    this.JournalMap = new Map<Number, JournalEntry>();
    this.JournalList = [];
    this.FilteredList = [];
    this.AIConversation = new Conversation();
  }

  /**
   * adds a journal entry to the collection & updates in firebase
   * @param entry the given journal entry
   */
  async addEntry(entry: JournalEntry): Promise<void> {
    this.ensureUniqueID(entry); // ensures the entry has a unique ID, and if not, it will give it a unique ID
    this.JournalMap.set(entry.ID, entry);
    this.JournalList.push(entry);
    this.saveEntryToFirebase(entry);
  }

  /**
   * ensures a given journal entry has a unique ID
   * @param entry the given journal entry
   */
  ensureUniqueID(entry: JournalEntry): void {
    const IDList = this.JournalList.map((e) => e.ID);
    const maxID = IDList.length > 0 ? Math.max(...IDList) : 1;
    entry.ID = maxID + 1;
  }

  /**
   * deleted a journal entry from the collection
   * @param id the id of the journal entry to delete
   */
  async deleteEntry(id: number): Promise<void> {
    const journal: JournalEntry | undefined = this.JournalMap.get(id); // find the journal entry
    this.JournalMap.delete(id);
    this.JournalList = this.JournalList.filter((e) => e.ID !== id);
    if (journal) {
      this.deleteEntryFromFirebase(journal);
    }
    console.log("after deleting entry: ", this.JournalMap);
  }

  /**
   * edits the rating of a journal entry
   * @param entry the journal entry ID to change the rating of
   * @param newRating the new rating to set it to
   */
  async editRating(entry: number, newRating: number) {
    const exists = this.JournalMap.get(entry);
    if (exists) {
      exists.editDayRating(newRating);
      this.saveEntryToFirebase(exists);
    }
  }

  /**
   * edits the text of the entry
   * @param entry the id of the entry
   * @param newEntryText the new text of the entry
   */
  async editEntryText(entry: number, newEntryText: string) {
    const exists = this.JournalMap.get(entry);
    if (exists) {
      exists.editEntry(newEntryText);
      this.saveEntryToFirebase(exists);
    }
  }

  /**
   * adds a users message to the conversation
   * @param message the message of the user
   */
  async addUserMessageToConversation(message: string): Promise<void> {
    this.AIConversation.addUserMessage(message);
    this.addUserMessagesToFirebase(
      message,
      this.AIConversation.userMessages.length
    );
  }

  /**
   * adds an AI message to the conversaition
   * @param message the message of the AI
   */
  async addAIMessageToConversation(message: string): Promise<void> {
    this.AIConversation.addAIMessage(message);
    this.addAIMessagesToFirebase(
      message,
      this.AIConversation.AIMessages.length
    );
  }

  /**
   * filters entries from given dates
   * @param Date1 the first date
   * @param Date2 the second date (optional) -> if not given, then it will be entries from first date and beyong,
   * if given, then it will be entries from the range
   */
  filterEntries(Date1: Date, Date2?: Date): void {
    if (Date2) {
      this.FilteredList = this.JournalList.filter(
        (e) => e.date >= Date1 && e.date <= Date2
      );
    } else {
      this.FilteredList = this.JournalList.filter((e) => e.date >= Date1);
    }
  }

  /**
   * calculates the average rating of the users entries from this month
   *  @returns the number
   */
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

  async addAIMessagesToFirebase(messages: string, id: number): Promise<void> {
    await addAIMessageToFireBase(messages, id);
  }

  async addUserMessagesToFirebase(messages: string, id: number): Promise<void> {
    await addUserMessagesToFireBase(messages, id);
  }
}

/**
 * represents a class for a journal entry, which is an entry with a date, title, and actual text for a user to talk about, followed by a
 * rating that a user can rate their entry.
 */
export default class JournalEntry {
  static nextID = 1;

  title: string; // title of the entry
  date: Date; // date of the entry
  dayRating: number; // 1 - 5
  sleep: number; // in minutes (not implemented)
  entry: string; // actual text of the entry
  aiSummary: string; // ai summary of entry (not implemented for rate limit)
  ID: number; // id of the entry for identification

  constructor(
    title?: string,
    date?: Date,
    dayRating?: number,
    sleep?: number,
    entry?: string,
    aiSummary?: string,
    ID?: number
  ) {
    this.title = title ? title : "Untitled";
    this.date = date ? date : new Date();
    this.dayRating = dayRating ? dayRating : 0;
    this.sleep = sleep ? sleep : 0;
    this.entry = entry ? entry : "";
    this.aiSummary = aiSummary ? aiSummary : "";

    this.ID = ID ? ID : JournalEntry.nextID++;
  }

  editTitle(newTitle: string): void {
    this.title = newTitle;
  }

  editDate(newDate: Date): void {
    this.date = newDate;
  }

  editDayRating(newRating: number): void {
    this.dayRating = newRating;
  }

  editSleep(newSleep: number): void {
    this.sleep = newSleep;
  }

  editEntry(newEntry: string): void {
    this.entry = newEntry;
  }

  editAISummary(newSummary: string): void {
    this.aiSummary = newSummary;
  }
}

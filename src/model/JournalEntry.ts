export default class JournalEntry {
  static nextID = 1;

  title: string;
  date: Date;
  dayRating: number; // 1 - 5
  sleep: number; // in minutes
  entry: string;
  aiSummary: string;
  ID: number;

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

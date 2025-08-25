import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import type JournalCollection from "../model/JournalCollection";
import JournalEntry from "../model/JournalEntry";

/**
 * loads the entries in the saved list
 * @param model the journal collection model to load to
 * @returns void
 */
export async function LoadEntryList(model: JournalCollection): Promise<void> {
  const user = auth.currentUser; // the current user
  if (!user) return;

  const entryCollection = collection(db, "users", user.uid, "entryList"); // the collection of the entries
  const snapshot = await getDocs(entryCollection); // gets the docs of the entry collection

  snapshot.forEach((entry) => {
    const journal = entry.data(); // gets the data for each entry item
    const AddJournal = new JournalEntry( // constructs the entry
      journal.title,
      new Date(journal.date),
      journal.rating,
      journal.sleep,
      journal.entry,
      journal.aiSummary,
      journal.ID
    );

    model.addEntry(AddJournal); // adds the entry to the journal collection
  });
}

/**
 * loads the AI messages into the model
 * @param model the model to load messages into
 * @returns void
 */
export async function LoadAIMessages(model: JournalCollection): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const AICollection = collection(db, "users", user.uid, "AIChatMessages");
  const snapshot = await getDocs(AICollection);

  snapshot.forEach((message) => {
    const messageString = message.data().message;

    if (messageString) {
      model.addAIMessageToConversation(messageString);
    }
  });
}

/**
 * loads the user messages into the model
 * @param model the user messages
 * @returns void
 */
export async function LoadUserMessages(
  model: JournalCollection
): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const UserCollection = collection(db, "users", user.uid, "UserChatMessages");
  const snapshot = await getDocs(UserCollection);

  snapshot.forEach((message) => {
    const messageString = message.data().message;

    if (messageString) {
      model.addUserMessageToConversation(messageString);
    }
  });
}

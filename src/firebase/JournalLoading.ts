import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import type JournalCollection from "../model/JournalCollection";
import JournalEntry from "../model/JournalEntry";

export async function LoadEntryList(model: JournalCollection): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const entryCollection = collection(db, "users", user.uid, "entryList");
  const snapshot = await getDocs(entryCollection);
  console.log("loading entry list");

  snapshot.forEach((entry) => {
    const journal = entry.data();
    console.log("adding entry: ", journal);
    const AddJournal = new JournalEntry(
      journal.title,
      new Date(journal.date),
      journal.rating,
      journal.sleep,
      journal.entry,
      journal.aiSummary,
      journal.ID
    );
    console.log(
      "is the journal an instance of: ",
      AddJournal instanceof JournalEntry
    );
    model.addEntry(AddJournal);
  });
}

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

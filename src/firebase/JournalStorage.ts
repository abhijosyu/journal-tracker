import { db, auth } from "../firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import type JournalEntry from "../model/JournalEntry";

export async function saveJournalEntryInFirebase(entry: JournalEntry) {
  const user = auth.currentUser;
  if (!user) return;
  console.log("saving journal entry: ", entry);

  const entryBrokenDown = {
    title: entry.title,
    date: entry.date.toDateString(),
    rating: entry.dayRating,
    sleep: entry.sleep,
    entry: entry.entry,
    aiSummary: entry.aiSummary,
    ID: entry.ID,
  };

  await setDoc(
    doc(db, "users", user.uid, "entryList", entryBrokenDown.ID.toString()),
    entryBrokenDown
  );
}

export async function deleteJournalEntryFromFirebase(entry: JournalEntry) {
  const user = auth.currentUser;
  if (!user) return;

  const entryRef = doc(db, "users", user.uid, "entryList", entry.ID.toString());
  if (entryRef) {
    await deleteDoc(entryRef);
  }
}

export async function addAIMessageToFireBase(AIMessages: string[]) {
  const user = auth.currentUser;
  if (!user) return;

  for (let i = 0; i < AIMessages.length; i++) {
    const message = AIMessages[i];
    await setDoc(doc(db, "users", user.uid, "AIChatMessages", i.toString()), {
      message: message,
    });
  }
}

export async function addUserMessagesToFireBase(UserMessages: string[]) {
  const user = auth.currentUser;
  if (!user) return;

  for (let i = 0; i < UserMessages.length; i++) {
    const message = UserMessages[i];

    await setDoc(doc(db, "users", user.uid, "UserChatMessages", i.toString()), {
      message: message,
    });
  }
}

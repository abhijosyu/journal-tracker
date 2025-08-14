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

export async function addAIMessageToFireBase(AIMessage: string, ID: number) {
  const user = auth.currentUser;
  if (!user) return;

  const id = ID.toString().padStart(3, "0");
  await setDoc(doc(db, "users", user.uid, "AIChatMessages", id), {
    message: AIMessage,
  });
}

export async function addUserMessagesToFireBase(
  UserMessage: string,
  ID: number
) {
  const user = auth.currentUser;
  if (!user) return;

  const id = ID.toString().padStart(3, "0");

  await setDoc(doc(db, "users", user.uid, "UserChatMessages", id), {
    message: UserMessage,
  });
}

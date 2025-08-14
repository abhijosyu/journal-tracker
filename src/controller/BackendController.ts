import type JournalEntry from "../model/JournalEntry";
// hi
class BackendController {
  static async getSummary(journalList: JournalEntry[]): Promise<any> {
    const today = new Date();
    const journalEntryTexts = journalList
      .filter((e) => e.date.getMonth() == today.getMonth())
      .map((e) => e.entry);
    console.log("sending message");
    const response = await fetch(
      "https://journal-tracker-0xbf.onrender.com/api/summarize",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journalList: journalEntryTexts }),
      }
    );
    console.log("got message: " + response);

    if (!response.ok) {
      throw new Error("AI request failed");
    }

    const data = await response.json();

    console.log("summary: ", data.summary);

    return {
      summary: data.summary,
    };
  }

  static async getChatResponse(
    question: string,
    journalList: JournalEntry[],
    currentJournal: number,
    previousMessages: string[][]
  ): Promise<any> {
    const allEntries = Array.from(journalList).map((entry) => ({
      date: entry.date,
      title: entry.title,
      text: entry.entry,
      rating: entry.dayRating,
      id: entry.ID,
    }));

    try {
      console.log("sending message chat");
      const response = await fetch(
        "https://journal-tracker-0xbf.onrender.com/api/chatting",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: question,
            tools: toolDescriptions,
            journalEntries: allEntries,
            currentJournal: currentJournal,
            previousMessages: previousMessages,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`AI request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("got message:", data);

      const isToolCall = (data: any): boolean => {
        try {
          return (
            data !== null &&
            typeof data.message === "string" &&
            data.message.includes("```json") &&
            data.message.includes("function") &&
            data.message.includes("parameters")
          );
        } catch (err) {
          console.warn("Failed to parse tool call:", err);
          return false;
        }
      };

      if (isToolCall(data)) {
        const cleaned = data.message.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
          type: "tool",
          message: parsed,
        };
      } else {
        return {
          type: "message",
          response: data.message,
        };
      }
    } catch (err) {
      console.error("AI request failed:", err);
      return {
        type: "message",
        response: "⚠️ Internal server error. Please try again later.",
      };
    }
  }
}

const toolDescriptions = [
  {
    function: "changeEntryTitle",
    description: "change the title of a journal entry",
    parameters: { originalTitle: "string", newTitle: "string" },
  },
  {
    function: "changeEntryText",
    description: "change the text of a journal entry",
    parameters: { text: "string" },
  },

  {
    function: "changeEntryRating",
    description: "change the rating of a journal entry",
    parameters: { rating: "number" },
  },

  {
    function: "addEntry",
    description: "add a journal entry of todays date",
    parameters: { title: "string", date: "Date" },
  },
  {
    function: "goToMainPage",
    description: "go to the main page of the site",
    parameters: {},
  },
  {
    function: "enterJournal",
    description:
      "go into a specific journal entry (the ID of the journal entry)",
    parameters: { id: "number" },
  },
  {
    function: "deleteJournal",
    description:
      "delete a specific journal entry (the ID of the journal entry)",
    parameters: { id: "number " },
  },
  {
    function: "enterAnalyzer",
    description: "enter the analyze/analysis page",
    parameters: {},
  },
];

export default BackendController;

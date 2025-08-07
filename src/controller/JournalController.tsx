import { useEffect, useState } from "react";
import JournalCollection from "../model/JournalCollection";
import BackendController from "../controller/BackendController";
import JournalEntry from "../model/JournalEntry";
import ViewDelegator from "../view/ViewDelegator";
import {
  LoadAIMessages,
  LoadEntryList,
  LoadUserMessages,
} from "../firebase/JournalLoading";

const JournalController: React.FC = () => {
  const [model] = useState(() => new JournalCollection());

  const [currentScreen, setCurrentScreen] = useState("main"); // main, entry, analysis (always lowercase)

  const [aiMessage, setAiMessage] = useState("");
  const [entryText, setEntryText] = useState("");
  const [entryRating, setEntryRating] = useState<number>(0);
  const [entryDate, setEntryDate] = useState<Date>(new Date());
  const [entrySleep, setEntrySleep] = useState<number>(0);
  const [entryTitle, setEntryTitle] = useState<string>("");

  const [currentJournal, setCurrentJournal] = useState<number>(0);
  const [journalEntriesList, setJournalEntriesList] = useState<JournalEntry[]>(
    []
  );

  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [canSendMessage, setCanSendMessage] = useState<boolean>(true);

  // analyzers

  const [analyzeAverageRating, setAnalyzeAverageRating] = useState<number>(0);
  const [analyzeAISummary, setAnalyzeAISummary] = useState<string>("");

  useEffect(() => {
    const todayDate = new Date();

    const loadTasks = async () => {
      try {
        await LoadEntryList(model);
        await LoadAIMessages(model);
        await LoadUserMessages(model);
      } catch (err) {
        console.error("failed to load: ", err);
        return;
      }

      console.log("model size after load: ", model.JournalList.length);

      const todayJournalExists = model.JournalList.some(
        (journal) => journal.date.toDateString() === todayDate.toDateString()
      );

      console.log("Is today already added?", todayJournalExists);

      if (!todayJournalExists) {
        addEntry();
      }

      setJournalEntriesList(model.JournalList);
    };

    loadTasks();
  }, []);

  const changeChatbot = () => {
    try {
      const currentChatbot = chatbotOpen;
      setChatbotOpen(!currentChatbot);
    } catch (e) {
      console.error("error: " + e);
    }
  };

  const changeEntryTitle = async (title: string, id?: number) => {
    try {
      const journalID = id ? id : currentJournal;
      setEntryTitle(title);
      model.JournalMap.get(journalID)?.editTitle(title);
      console.log(model.JournalMap.get(journalID)?.title);
    } catch (e) {
      console.error("error: " + e);
    }
  };

  const askAIQuestion = async (question: string) => {
    try {
      console.log("adding question: " + question);
      setAiMessage("Responding...");
      model.addUserMessageToConversation(question);
      setCanSendMessage(false);
      const response = await BackendController.getChatResponse(
        question,
        model.JournalList,
        currentJournal,
        model.AIConversation.AIMessages[model.AIConversation.AIMessages.length]
      );
      console.log("got the message in journalcontroller: ", response);
      console.log("response type: ", response.type);
      if (response.type == "message") {
        setAiMessage("");
        model.addAIMessageToConversation(response.response);
      } else {
        console.log(
          "function: " +
            response.message.function +
            " with the parameters: " +
            response.message.parameters
        );
        await delegateAIAction(
          response.message.function,
          response.message.parameters
        );
        setAiMessage("");
        model.addAIMessageToConversation("executed action");
      }

      setCanSendMessage(true);
    } catch (e) {
      console.error("Error: " + e);
      setCanSendMessage(true);
    }
  };

  const generateSummary = async () => {
    try {
      if (entryText != null) {
        const summary = await BackendController.getSummary(journalEntriesList);
        setAnalyzeAISummary(summary.summary);
      } else {
        setAnalyzeAISummary("Not enough data yet");
      }
    } catch (e) {
      console.error("AI error:", e);
    }
  };

  const delegateAIAction = async (
    funct: string,
    parameters: { [key: string]: any }
  ) => {
    switch (funct) {
      case "goToMainPage": {
        goToMainPage();
        break;
      }
      case "addEntry": {
        const { title, date } = parameters;
        function parseDateLocal(dateStr: string): Date {
          const [year, month, day] = dateStr.split("-").map(Number);
          return new Date(year, month - 1, day); // month is 0-based
        }
        addEntry(title, parseDateLocal(date));
        break;
      }
      case "changeEntryTitle": {
        const { originalTitle, newTitle } = parameters;

        let upperOriginal = originalTitle.toLocaleUpperCase();

        const getEntryByTitle = (title: string): JournalEntry | undefined => {
          return [...model.JournalMap.values()].find(
            (entry) => entry.title.toLocaleUpperCase() == title
          );
        };

        const matchingEntry = getEntryByTitle(upperOriginal);

        console.log(matchingEntry);

        if (matchingEntry) {
          setCurrentJournal(matchingEntry.ID);

          console.log(
            "sending to change entry title with current journal as: ",
            matchingEntry.ID
          );
          changeEntryTitle(newTitle, matchingEntry.ID);
          console.log("the updated entry title: ", entryTitle);
        } else {
          console.warn("No journal entry found with title:", originalTitle);
        }

        break;
      }
      case "changeEntryText": {
        const { text } = parameters;
        changeEntryText(text);
        break;
      }
      case "changeEntryRating": {
        const { rating } = parameters;
        changeEntryRating(rating);
        break;
      }
      case "enterJournal": {
        const { id } = parameters;
        enterJournal(id);
        break;
      }
      case "deleteJournal": {
        const { id } = parameters;
        console.log("reached deleteJournal in controller");
        deleteJournal(id);
        setJournalEntriesList(model.JournalList);
        break;
      }
      case "enterAnalyzer": {
        enterAnalyzer();
        break;
      }
    }
  };

  const changeEntryText = (text: string) => {
    console.log("ive been called to change the entry text with text: " + text);
    try {
      model.JournalMap.get(currentJournal)?.editEntry(text);
      setEntryText(text);
      console.log(model.JournalMap.get(currentJournal)?.entry);
    } catch (e) {
      console.error("error: " + e);
    }
  };

  const changeEntryRating = (rating: number) => {
    try {
      let adjustedRating = rating;
      if (rating == model.JournalMap.get(currentJournal)?.dayRating) {
        adjustedRating = rating - 1;
      }
      model.editRating(currentJournal, adjustedRating);

      setEntryRating(adjustedRating);
      setAnalyzeAverageRating(model.averageRating());
      console.log(model.JournalMap.get(currentJournal)?.dayRating);
    } catch (e) {
      console.error("error: " + e);
    }
  };

  const enterAnalyzer = () => {
    setCurrentScreen("analysis");
    generateSummary();
  };

  const addEntry = (title?: string, date?: Date): void => {
    try {
      console.log("at adding an entry");
      const journal = new JournalEntry(title, date);
      model.addEntry(journal);
      setJournalEntriesList(model.JournalList);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  const deleteJournal = (ID: number): void => {
    console.log("deleting journal with id: " + ID);
    const journal = model.JournalMap.get(ID);
    console.log("found journal: ", journal);
    try {
      if (journal) {
        if (currentJournal == journal.ID) {
          goToMainPage();
        }
        model.deleteEntry(ID);
      }
    } catch (e) {
      console.error("error: " + e);
    }
  };

  const enterJournal = (ID: number): void => {
    const journal = model.JournalMap.get(ID);
    try {
      if (journal) {
        setAiMessage(journal.aiSummary);
        setEntryText(journal.entry);
        setCurrentJournal(journal.ID);
        setEntryRating(journal.dayRating);
        setEntryDate(journal.date);
        setEntrySleep(journal.sleep);
        setEntryTitle(journal.title);
        setCurrentScreen("entry");

        console.log(journal);
      }
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  const goToMainPage = (): void => {
    setCurrentScreen("main");
    setCurrentJournal(0);
  };

  return (
    <>
      <ViewDelegator
        currentScreen={currentScreen}
        journalEntriesList={journalEntriesList}
        aiSummary={aiMessage}
        entryText={entryText}
        currentJournal={currentJournal}
        onEnterJournal={enterJournal}
        entryRating={entryRating}
        entryDate={entryDate}
        entrySleep={entrySleep}
        entryTitle={entryTitle}
        onHeaderClick={goToMainPage}
        onEntryTitleEdit={changeEntryTitle}
        onEntryRatingEdit={changeEntryRating}
        onEntryTextEdit={changeEntryText}
        onChangeChatbot={changeChatbot}
        chatbotOpen={chatbotOpen}
        userMessages={model.AIConversation.userMessages}
        AIMessages={model.AIConversation.AIMessages}
        onSendMessage={askAIQuestion}
        canSendMessage={canSendMessage}
        onAnalyzeButtonClick={enterAnalyzer}
        averageRating={analyzeAverageRating}
        analyzeAISummary={analyzeAISummary}
      />
    </>
  );
};

export default JournalController;

/**
 * <button onClick={generateSummary}>Generate AI Summary</button>
      {aiSummary && (
        <p>
          <strong>AI Summary:</strong> {aiSummary}
        </p>
      )}
 */

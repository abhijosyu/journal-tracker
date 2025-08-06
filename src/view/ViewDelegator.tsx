import type JournalEntry from "../model/JournalEntry";
import AnalysisPage from "./AnalysisPage";
import EntryPage from "./EntryPage";
import MainPage from "./MainPage";

interface ViewDelegatorProps {
  journalEntriesList: JournalEntry[];
  currentScreen: string;
  aiSummary: string;
  entryText: string;
  currentJournal: number;
  onEnterJournal: (ID: number) => void;
  entryRating: number;
  entryDate: Date;
  entrySleep: number;
  entryTitle: string;
  onHeaderClick: () => void;
  onEntryTitleEdit: (title: string) => void;
  onEntryRatingEdit: (rating: number) => void;
  onEntryTextEdit: (text: string) => void;
  onChangeChatbot: () => void;
  chatbotOpen: boolean;
  userMessages: string[];
  AIMessages: string[];
  onSendMessage: (message: string) => void;
  canSendMessage: boolean;
  onAnalyzeButtonClick: () => void;
  averageRating: number;
  analyzeAISummary: string;
}

const ViewDelegator: React.FC<ViewDelegatorProps> = ({
  journalEntriesList,
  currentScreen,
  aiSummary,
  entryText,
  onEnterJournal,
  entryRating,
  entryDate,
  entrySleep,
  entryTitle,
  onHeaderClick,
  onEntryTitleEdit,
  onEntryRatingEdit,
  onEntryTextEdit,
  onChangeChatbot,
  chatbotOpen,
  userMessages,
  AIMessages,
  onSendMessage,
  canSendMessage,
  onAnalyzeButtonClick,
  averageRating,
  analyzeAISummary,
}) => {
  if (currentScreen == "main") {
    return (
      <MainPage
        journalEntriesList={journalEntriesList}
        onEnterJournal={onEnterJournal}
        onHeaderClick={onHeaderClick}
        onChangeChatbot={onChangeChatbot}
        chatbotOpen={chatbotOpen}
        userMessages={userMessages}
        AIMessages={AIMessages}
        onSendMessage={onSendMessage}
        canSendMessage={canSendMessage}
        aiSummary={aiSummary}
        currentScreen={currentScreen}
        onAnalyzeButtonClick={onAnalyzeButtonClick}
      ></MainPage>
    );
  } else if (currentScreen == "entry") {
    return (
      <EntryPage
        aiSummary={aiSummary}
        entryText={entryText}
        entryRating={entryRating}
        entryDate={entryDate}
        entrySleep={entrySleep}
        entryTitle={entryTitle}
        onHeaderClick={onHeaderClick}
        onEntryTitleEdit={onEntryTitleEdit}
        onEntryRatingEdit={onEntryRatingEdit}
        onEntryTextEdit={onEntryTextEdit}
        onChangeChatbot={onChangeChatbot}
        chatbotOpen={chatbotOpen}
        userMessages={userMessages}
        AIMessages={AIMessages}
        onSendMessage={onSendMessage}
        canSendMessage={canSendMessage}
        currentScreen={currentScreen}
        onAnalyzeButtonClick={onAnalyzeButtonClick}
      ></EntryPage>
    );
  } else if (currentScreen == "analysis") {
    return (
      <AnalysisPage
        onHeaderClick={onHeaderClick}
        onChangeChatbot={onChangeChatbot}
        currentScreen={currentScreen}
        onAnalyzeButtonClick={onAnalyzeButtonClick}
        journalEntriesList={journalEntriesList}
        chatbotOpen={chatbotOpen}
        userMessages={userMessages}
        AIMessages={AIMessages}
        onSendMessage={onSendMessage}
        canSendMessage={canSendMessage}
        aiSummary={aiSummary}
        averageRating={averageRating}
        analyzeAISummary={analyzeAISummary}
      ></AnalysisPage>
    );
  }
};

export default ViewDelegator;

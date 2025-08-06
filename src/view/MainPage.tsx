import { useEffect, useState } from "react";
import Chatbot from "../components/Chatbot/Chatbot";
import Header from "../components/Header/Header";
import JournalBox from "../components/JournalBox/JournalBox";
import JournalEntry from "../model/JournalEntry";
import "../view/MainPage.css";

interface MainPageProps {
  journalEntriesList: JournalEntry[];
  onEnterJournal: (ID: number) => void;
  onHeaderClick: () => void;
  onChangeChatbot: () => void;
  chatbotOpen: boolean;
  userMessages: string[];
  AIMessages: string[];
  onSendMessage: (message: string) => void;
  canSendMessage: boolean;
  aiSummary: string;
  currentScreen: string;
  onAnalyzeButtonClick: () => void;
}

const MainPage: React.FC<MainPageProps> = ({
  journalEntriesList,
  onEnterJournal,
  onHeaderClick,
  onChangeChatbot,
  chatbotOpen,
  userMessages,
  AIMessages,
  onSendMessage,
  canSendMessage,
  aiSummary,
  currentScreen,
  onAnalyzeButtonClick,
}) => {
  const reversedList = [...journalEntriesList].reverse();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.log(reversedList);
  return (
    <div className="MainPageWrapper">
      <div className="headerContainer">
        <Header
          onHeaderClick={onHeaderClick}
          onChangeChatbot={onChangeChatbot}
          screen={currentScreen}
          onAnalyzeButtonClick={onAnalyzeButtonClick}
        ></Header>
      </div>
      <div className="MainPage" style={{ height: "100vh", width: "100%" }}>
        {isMobile && chatbotOpen ? null : (
          <div
            className="journalEntriesContainer"
            style={{
              width: chatbotOpen ? "75%" : "100%",
            }}
          >
            {reversedList.map((e) => (
              <JournalBox
                onClick={onEnterJournal}
                ID={e.ID}
                key={e.ID}
                title={e.title}
                date={e.date}
                rating={e.dayRating}
              ></JournalBox>
            ))}
          </div>
        )}

        {chatbotOpen ? (
          <div className="chatbotContainer">
            <Chatbot
              userMessages={userMessages}
              AIMessages={AIMessages}
              onSendMessage={onSendMessage}
              canSendMessage={canSendMessage}
              aiSummary={aiSummary}
            ></Chatbot>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MainPage;

import Chatbot from "../components/Chatbot/Chatbot";
import EntryRating from "../components/EntryRating/EntryRating";
import EntryText from "../components/EntryText/EntryText";
import EntryTextButton from "../components/EntryTextButton/EntryTextButton";
import EntryTitle from "../components/EntryTitle/EntryTitle";
import Header from "../components/Header/Header";
import "../view/EntryPage.css";
import { useEffect, useState } from "react";

interface EntryPageProps {
  aiSummary: string;
  entryText: string;
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
  currentScreen: string;
  onAnalyzeButtonClick: () => void;
}

const EntryPage: React.FC<EntryPageProps> = ({
  aiSummary,
  entryText,
  entryRating,
  entryDate,
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
  currentScreen,
  onAnalyzeButtonClick,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [entryTitleCurrent, setEntryTitleCurrent] =
    useState<string>(entryTitle);

  useEffect(() => {
    try {
      onEntryTitleEdit(entryTitleCurrent);
    } catch (e) {
      throw new Error("Error: " + e);
    }
  }, [entryTitleCurrent]);

  const [entryTextCurrent, setEntryTextCurrent] = useState<string>(entryText);

  const isUpdated = entryText == entryTextCurrent;

  const [isEntryTextUpdatedCurrent, setIsEntryTextUpdatedCurrent] =
    useState<boolean>(isUpdated);

  const changeEntryText = (): void => {
    console.log("changing the text");
    onEntryTextEdit(entryTextCurrent);
    setIsEntryTextUpdatedCurrent(true);
  };

  useEffect(() => {
    console.log("changing the text");
    setEntryTitleCurrent(entryTitle);
  }, [entryTitle]);

  useEffect(() => {
    console.log("changing the text");
    setIsEntryTextUpdatedCurrent(false);
  }, [entryTextCurrent]);

  console.log(
    "in entrypage checking if the entrytext is updated ",
    isEntryTextUpdatedCurrent
  );

  return (
    <div className="entryPageWrapper">
      <div className="headerContainer">
        <Header
          onHeaderClick={() => {
            onHeaderClick(), changeEntryText();
          }}
          onChangeChatbot={onChangeChatbot}
          screen={currentScreen}
          onAnalyzeButtonClick={onAnalyzeButtonClick}
          isEntryTextUpdated={isEntryTextUpdatedCurrent}
          onClick={changeEntryText}
        ></Header>
      </div>
      <div className="entryContainer">
        <div className="entryCenteredInfo">
          <div className="entryTitle">
            <EntryTitle
              setValue={entryTitleCurrent}
              onChange={(e) => setEntryTitleCurrent(e.target.value)}
            />
          </div>
          <div className="smallCenteredInfo">
            <h3 className="entryDate">{formatDueDate(entryDate)} | </h3>
            <EntryRating
              rating={entryRating}
              onEntryRatingEdit={onEntryRatingEdit}
            ></EntryRating>
          </div>
        </div>
        <div className="entryPage">
          {isMobile && chatbotOpen ? null : (
            <div className="entryTextContainer">
              <EntryText
                setValue={entryTextCurrent}
                onChange={(e) => {
                  setEntryTextCurrent(e.target.value);
                }}
              />
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
    </div>
  );
};

export default EntryPage;

const formatDueDate = (dueDate: Date): string => {
  const today = new Date();

  const timeDiff = dueDate.getDate() - today.getDate();

  if (timeDiff >= 0 && timeDiff <= 7) {
    if (timeDiff == 0) {
      return "Today";
    }
    if (timeDiff == 1) {
      return "Tomorrow";
    }
    return dueDate.toLocaleDateString("en-US", { weekday: "long" });
  } else if (timeDiff == -1) {
    return "Yesterday";
  } else {
    return dueDate.toLocaleDateString();
  }
};

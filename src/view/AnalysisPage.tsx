import { SpotLight } from "@react-three/drei";
import Chatbot from "../components/Chatbot/Chatbot";
import Header from "../components/Header/Header";
import type JournalEntry from "../model/JournalEntry";
import "../view/AnalysisPage.css";
import { Chart as ChartJS } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import SpotlightCard from "../blocks/Components/SpotlightCard/SpotlightCard";

interface AnalysisPageProps {
  onHeaderClick: () => void;
  onChangeChatbot: () => void;
  currentScreen: string;
  onAnalyzeButtonClick: () => void;
  journalEntriesList: JournalEntry[];
  chatbotOpen: boolean;
  userMessages: string[];
  AIMessages: string[];
  onSendMessage: (message: string) => void;
  canSendMessage: boolean;
  aiSummary: string;
  averageRating: number;
  analyzeAISummary: string;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({
  onHeaderClick,
  onChangeChatbot,
  currentScreen,
  onAnalyzeButtonClick,
  journalEntriesList,
  chatbotOpen,
  userMessages,
  AIMessages,
  onSendMessage,
  canSendMessage,
  aiSummary,
  averageRating,
  analyzeAISummary,
}) => {
  const monthEntries = journalEntriesList.filter(
    (e) => e.date.getMonth() == new Date().getMonth()
  );

  const starFilter = (number: number) => {
    return monthEntries.filter((e) => e.dayRating == number).length;
  };

  const data = {
    labels: [
      "☆",
      "⭐️",
      "⭐️⭐️",
      "⭐️⭐️⭐️",
      "⭐️⭐️⭐️⭐️",
      "⭐️⭐️⭐️⭐️⭐️",
    ],
    datasets: [
      {
        data: [
          starFilter(0),
          starFilter(1),
          starFilter(2),
          starFilter(3),
          starFilter(4),
          starFilter(5),
        ],
        backgroundColor: [
          "rgba(149, 195, 249, 0.7)",
          "rgba(137, 146, 239, 0.7)",
          "rgba(173, 94, 246, 0.7)",
          "rgba(181, 67, 215, 0.7)",
          "rgba(240, 80, 163, 0.7)",
          "rgba(219, 47, 110, 0.7)",
        ],
        borderColor: "#804d6977",
        borderWidth: 1.5,
        borderRadius: 0,
        radius: 140,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right" as const,
        labels: {
          boxWidth: 20,
          padding: 15,
        },
      },
    },
  };

  return (
    <div className="AnalysisWrapper">
      <div className="headerContainer">
        <Header
          onHeaderClick={onHeaderClick}
          onChangeChatbot={onChangeChatbot}
          screen={currentScreen}
          onAnalyzeButtonClick={onAnalyzeButtonClick}
        />
      </div>

      <div className="analysisPage">
        <div className="analysisInfo cardsFadeIn">
          <SpotlightCard>
            <h1> Summary:</h1>
            <p> {analyzeAISummary} </p>
          </SpotlightCard>
          <SpotlightCard>
            <h1>Average Rating: </h1>
            <h3> {averageRating}</h3>
            <h1>This Months Ratings: </h1>

            <div
              className="donutWrapper"
              style={{ width: "410px", height: "410px" }}
            >
              <Doughnut data={data} options={options} />
            </div>
          </SpotlightCard>
        </div>

        {chatbotOpen && (
          <div className="chatbotContainer">
            <Chatbot
              userMessages={userMessages}
              AIMessages={AIMessages}
              onSendMessage={onSendMessage}
              canSendMessage={canSendMessage}
              aiSummary={aiSummary}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;

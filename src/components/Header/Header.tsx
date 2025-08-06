import GradientText from "../../blocks/TextAnimations/GradientText/GradientText";
import "../Header/Header.css";

interface HeaderProps {
  onHeaderClick: () => void;
  onChangeChatbot: () => void;
  screen: string;
  onAnalyzeButtonClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onHeaderClick,
  onChangeChatbot,
  screen,
  onAnalyzeButtonClick,
}) => {
  return (
    <>
      <div className="headerLeft headerFadeInSide">
        {screen == "main" ? (
          <div className="headerLeftButtons">
            <button
              className="headerButtonSort"
              onClick={() => onAnalyzeButtonClick()}
            >
              Analyze
            </button>
          </div>
        ) : null}
      </div>
      <div className="headerCenter">
        <GradientText
          colors={[
            "#a340ffff",
            "#6d40ffff",
            "#d240ffff",
            "#4079ff",
            "#a040ffff",
          ]}
          animationSpeed={3}
          showBorder={false}
          className="headerText"
          headerClick={onHeaderClick}
        >
          MindMeld
        </GradientText>
      </div>
      <div className="headerRight">
        <button
          className="headerAiChatbot"
          onClick={() => onChangeChatbot()}
        ></button>
      </div>
    </>
  );
};

export default Header;

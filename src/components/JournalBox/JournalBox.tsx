import starFilled from "../../../public/Images/StarFilled.png";
import starUnfilled from "../../../public/Images/StarUnfilled.png";
import backgroundImage from "../../../public/Images/MainPageJournalBox.png";

import "../JournalBox/JournalBox.css";
import ShinyText from "../../blocks/TextAnimations/ShinyText/ShinyText";

interface JournalBoxProps {
  ID: number;
  onClick: (ID: number) => void;
  title: string;
  date: Date;
  rating: number;
}

const JournalBox: React.FC<JournalBoxProps> = ({
  title,
  date,
  rating,
  onClick,
  ID,
}) => (
  <div className="JournalBox boxFadeIn" onClick={() => onClick(ID)}>
    <h1>
      <ShinyText text={title} speed={3} className={"journalBox"} />
    </h1>
    <p> {formatDueDate(date)} </p>
    <div className="stars">
      <img src={rating >= 1 ? starFilled : starUnfilled} alt="Star" />
      <img src={rating >= 2 ? starFilled : starUnfilled} alt="Star" />
      <img src={rating >= 3 ? starFilled : starUnfilled} alt="Star" />
      <img src={rating >= 4 ? starFilled : starUnfilled} alt="Star" />
      <img src={rating >= 5 ? starFilled : starUnfilled} alt="Star" />
    </div>
    <img
      className="backgroundImage"
      src={backgroundImage}
      alt="backgroundImage"
    />
  </div>
);

export default JournalBox;

function parseDateLocal(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-based
}

const formatDueDate = (dueDateInput: Date | string): string => {
  const dueDate =
    typeof dueDateInput == "string"
      ? parseDateLocal(dueDateInput)
      : dueDateInput;
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

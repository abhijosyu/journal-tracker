import "../EntryTextButton/EntryTextButton.css";

interface EntryTextButtonProps {
  isEntryTextUpdated: boolean;
  onClick: () => void;
}

const EntryTextButton: React.FC<EntryTextButtonProps> = ({
  isEntryTextUpdated,
  onClick,
}) => {
  console.log(
    "this checks whether the entry text is updated: ",
    isEntryTextUpdated
  );
  return (
    <button
      className={isEntryTextUpdated ? "updatedButton" : "notUpdatedButton"}
      onClick={isEntryTextUpdated ? undefined : () => onClick()}
    >
      Save Text
    </button>
  );
};

export default EntryTextButton;

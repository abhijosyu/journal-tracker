import "../EntryText/EntryText.css";

interface EntryTextProps {
  setValue: string;
  onChange: (e: any) => void;
}

const EntryText: React.FC<EntryTextProps> = ({ setValue, onChange }) => {
  return (
    <textarea
      className="entryText"
      spellCheck={false}
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      value={setValue}
      onChange={(e) => onChange(e)}
      placeholder="Type here"
      style={{ color: setValue == "Type here" ? "grey" : "black" }}
    />
  );
};

export default EntryText;

import "../EntryTitle/EntryTitle.css";

interface EntryTitleProps {
  setValue: string;
  onChange: (e: any) => void;
}

const EntryTitle: React.FC<EntryTitleProps> = ({ setValue, onChange }) => {
  // for 20 chars, 50, decrease by 10 for each 20

  const fontsize = (text: string): number => {
    let fontNumber;
    text.length < 100
      ? (fontNumber = 50)
      : (fontNumber = 50 - Math.round(text.length / 96) * 5);
    return fontNumber;
  };

  return (
    <textarea
      rows={1}
      className="entryTitleText"
      spellCheck={false}
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      value={setValue}
      onChange={(e) => onChange(e)}
      placeholder="Untitled"
      style={{
        color: setValue == "Untitled" ? "grey" : "black",
        fontSize: `${fontsize(setValue)}px`,
      }}
    />
  );
};

export default EntryTitle;

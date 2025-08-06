import "../EntryRating/EntryRating.css";

interface StarButtonProps {
  rating: number;
  targetRating: number;
  onEntryRatingEdit: (rating: number) => void;
}

const StarButton: React.FC<StarButtonProps> = ({
  rating,
  targetRating,
  onEntryRatingEdit,
}) => {
  return (
    <button
      className={
        rating >= targetRating ? "starButtonFilled" : "starButtonUnfilled"
      }
      onClick={() => onEntryRatingEdit(targetRating)}
    ></button>
  );
};

export default StarButton;

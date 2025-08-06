import "../EntryRating/EntryRating.css";

import StarButton from "./StarButton";

interface EntryRatingProps {
  rating: number;
  onEntryRatingEdit: (rating: number) => void;
}

const EntryRating: React.FC<EntryRatingProps> = ({
  rating,
  onEntryRatingEdit,
}) => {
  return (
    <div className="entryButtons">
      <StarButton
        rating={rating}
        targetRating={1}
        onEntryRatingEdit={onEntryRatingEdit}
      ></StarButton>
      <StarButton
        rating={rating}
        targetRating={2}
        onEntryRatingEdit={onEntryRatingEdit}
      ></StarButton>
      <StarButton
        rating={rating}
        targetRating={3}
        onEntryRatingEdit={onEntryRatingEdit}
      ></StarButton>
      <StarButton
        rating={rating}
        targetRating={4}
        onEntryRatingEdit={onEntryRatingEdit}
      ></StarButton>
      <StarButton
        rating={rating}
        targetRating={5}
        onEntryRatingEdit={onEntryRatingEdit}
      ></StarButton>
    </div>
  );
};

export default EntryRating;

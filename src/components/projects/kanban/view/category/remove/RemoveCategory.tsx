import { DeleteKanbanCategory, WSType } from "@/utils/types";
import "./removecategory.css";

export interface RemoveCategoryProps {
  id: string;
  sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function RemoveCategory(props: RemoveCategoryProps) {
  const { id, sendMessage } = props;

  const handleClick = () => {
    sendMessage(DeleteKanbanCategory, { id: id });
  };

  return (
    <img
      className="remove-category-icon"
      src={`${import.meta.env.BASE_URL}icons/trashcan.svg`}
      onClick={handleClick}
    />
  );
}

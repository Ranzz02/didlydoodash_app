import { DeleteKanbanItem, KanbanItem, WSType } from "@/utils/types";
import "./removeitem.css";

export interface RemoveItemProps {
  item: KanbanItem;
  sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function RemoveItem(props: RemoveItemProps) {
  const { item, sendMessage } = props;

  return (
    <img
      className="remove-item-icon"
      src={`${import.meta.env.BASE_URL}icons/trashcan.svg`}
      onClick={(event) => {
        event.stopPropagation();
        sendMessage(DeleteKanbanItem, { itemId: item.id });
      }}
    />
  );
}

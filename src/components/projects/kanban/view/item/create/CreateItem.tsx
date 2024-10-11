import { NewKanbanItem, WSType } from "@/utils/types";
import "./createitem.css";

export interface CreateItemProps {
	sendMessage: (type: WSType, payload: any) => Promise<void>;
}

export default function CreateItem(props: CreateItemProps) {
	const { sendMessage } = props;

	return (
		<img
			className="add-item-icon"
			src="/icons/plus.svg"
			onClick={() => sendMessage(NewKanbanItem, { name: "Not named" })}
		/>
	);
}

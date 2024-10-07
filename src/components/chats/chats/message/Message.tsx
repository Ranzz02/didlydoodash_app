import { WSChatMessage } from "@/utils/types";
import "./message.css";
import { useAuthStore } from "@/stores/auth/store";
import { Tooltip } from "@mui/material";

export interface MessageProps {
	message: WSChatMessage;
}

export default function MessageItem(props: MessageProps) {
	const { message } = props;
	const { user } = useAuthStore();
	const own = user?.id == message.userId ? "own" : "";

	return (
		<Tooltip title={user?.username} placement="bottom-start">
			<div className={`message ${own}`}>
				<img src="/icons/avatars/avatar-boy.svg" alt="" />
				<div className={`texts ${own}`}>
					<p>{message.message}</p>
					<span>
						{message.createdAt &&
							"Sent:" + new Date(message.createdAt).toLocaleString()}
					</span>
				</div>
			</div>
		</Tooltip>
	);
}

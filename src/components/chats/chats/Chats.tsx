import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import "./chats.css";
import { useAuthStore } from "@/stores/auth/store";
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from "@/stores/organisation/chats";
import { Tooltip } from "@mui/material";
import useWebSocket from "react-use-websocket";
import { useOrgStore } from "@/stores/organisation";
import { toast } from "react-toastify";
import MessageItem from "./message/Message";
import {
	MessageAll,
	MessageError,
	MessageSend,
	User,
	WSChatMessage,
	WSInputMessage,
	WSMessage,
} from "@/utils/types";
import AddUser from "./addUser/AddUser";
import { API } from "@/utils/api";

export default function Chats() {
	const { chats, chatId, selectChat, removeMember } = useChatStore();
	const { user, tokens } = useAuthStore();
	const { organisation } = useOrgStore();

	const endRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);
	const [openAddUser, setOpenAddUser] = useState(false);
	const [text, setText] = useState("");

	const [messages, setMessages] = useState<WSChatMessage[]>([]);

	const openChat = chats.find((chat) => chat.id === chatId);

	const WS_URL = `ws://localhost:3000/organisations/${organisation?.id}/chats/${chatId}?token=${tokens?.access}`;

	const handleEmoji = (e: any) => {
		setText((prev) => prev + e.emoji);
		setOpen(false);
	};

	const handleAddUser = () => {
		setOpenAddUser(true);
	};

	const handleCloseChat = () => {
		selectChat(null);
	};

	const { sendJsonMessage, lastMessage } = useWebSocket(WS_URL, {
		onOpen: () => {
			console.log("Websocket connection established");
		},
		onClose: () => {
			console.log("Connection closed");
		},
		onMessage: (data) => {
			console.log("Message: " + data.data);
		},
		reconnectAttempts: 5,
		onReconnectStop: (attempts) => {
			toast.error(`Failed to reconnect to websocket: ${attempts}`, {
				position: "top-left",
			});
		},
	});

	const handleSend = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (text === "") return;

			sendJsonMessage<WSInputMessage>({
				type: "message.send",
				roomId: chatId || "",
				payload: {
					id: user?.id || "",
					message: text,
				},
			});
			setText("");
		},
		[sendJsonMessage, text, chatId, user]
	);

	const handleRemoveUser = (user: User) => {
		return API.delete(
			`/api/organisations/${organisation?.id}/chats/${chatId}/member/${user.id}`
		)
			.then((response) => {
				toast.success(`User ${user.username} removed!`);
				if (chatId) removeMember(chatId, response.data.member);
			})
			.catch(() => {
				toast.error(`Failed to remove ${user.username}`, {
					position: "top-left",
				});
			});
	};

	useEffect(() => {
		if (!lastMessage || !chatId) return;
		try {
			// Parse the message and cast it as WSMessage
			const parsedData: WSMessage = JSON.parse(lastMessage?.data);

			// Check if the message type is 'message.send' and if it belongs to the current room
			if (parsedData.type === MessageSend && parsedData.roomId === chatId) {
				setMessages((prev) => [...prev, parsedData.payload]);
			} else if (
				parsedData.type === MessageAll &&
				parsedData.roomId === chatId
			) {
				setMessages(parsedData.payload);
			} else if (parsedData.type === MessageError) {
				toast.error("Failed to load messages", {
					position: "top-left",
				});
			}
		} catch (error) {
			console.error("Failed to parse WebSocket message:", error);
		}
	}, [lastMessage, chatId]);

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div className="chat">
			<div className="top">
				<div className="user">
					<img src={user?.avatar || "/icons/avatars/avatar-girl2.svg"} alt="" />
					<div className="texts">
						<h2>{openChat?.name}</h2>
						<p style={{ display: "flex", gap: "15px", alignItems: "center" }}>
							Members:
							{openChat?.members.map((member) => (
								<Tooltip title={`Remove user`}>
									<span onClick={() => handleRemoveUser(member.member)}>
										{member.member.username}
									</span>
								</Tooltip>
							))}
						</p>
					</div>
				</div>
				<div className="icons">
					<Tooltip title="Add user to chat" placement="top-start">
						<img src="/icons/plus.svg" alt="" onClick={handleAddUser} />
					</Tooltip>
					<Tooltip title="Close chat" placement="top-start">
						<img src="/icons/close.svg" alt="" onClick={handleCloseChat} />
					</Tooltip>
					<AddUser open={openAddUser} setOpen={setOpenAddUser} />
				</div>
			</div>
			<div className="center">
				{messages.map((message) => {
					return <MessageItem message={message} />;
				})}
				<div id="bottom" ref={endRef}></div>
			</div>
			<form className="bottom" onSubmit={handleSend}>
				<input
					type="text"
					placeholder="Type a message..."
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<div className="emoji">
					<img src="/icons/emoji.svg" alt="" onClick={() => setOpen(!open)} />
					<div className="picker">
						<EmojiPicker
							open={open}
							lazyLoadEmojis
							onEmojiClick={handleEmoji}
						/>
					</div>
				</div>
				<button className="sendButton" type="submit" disabled={false}>
					Send
				</button>
			</form>
		</div>
	);
}

import { useEffect, useState } from "react";
import "./chatslist.css";
import AddChat from "./addChat/AddChat";
import { useChatStore } from "@/stores/organisation/chats";
import { useQuery } from "react-query";
import { Chat } from "@/utils/types";
import { useOrgStore } from "@/stores/organisation";
import { toast } from "react-toastify";
import { API } from "@/utils/api";
import { Badge, Tooltip } from "@mui/material";
import { useNotification } from "@/context/NotificationContext";

export default function ChatsList() {
  const [addMore, setAddMore] = useState<boolean>(false);
  const [input, SetInput] = useState<string>("");
  const { chats, openChatId, setChats, selectChat } = useChatStore();
  const { badges, resetBadge } = useNotification();
  const { organisation } = useOrgStore();

  // Fetch chats
  const { isLoading, isError, error } = useQuery<Chat[], Error>(
    ["chats", organisation],
    getChats,
    {
      onSuccess: (data) => {
        setChats(data);
      },
    }
  );

  const handleSelect = async (chat: Chat) => {
    const foundChat = chats.find((item) => item.id === chat.id);

    if (foundChat) {
      selectChat(foundChat.id);
      badges.set(foundChat.id, 0);
    }
  };

  const handleAddMore = () => {
    setAddMore(true);
  };

  const filteredChats = chats
    ? chats.filter((c) => c.name.toLowerCase().includes(input.toLowerCase()))
    : [];

  // Example: Reset badge when a chat is opened
  useEffect(() => {
    if (openChatId) resetBadge(openChatId); // Reset unread messages for the opened chat
  }, [openChatId, resetBadge, badges]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src={`${import.meta.env.BASE_URL}icons/search.svg`} alt="" />
          <input
            type="text"
            placeholder="Search"
            value={input}
            onChange={(e) => SetInput(e.target.value)}
          />
        </div>
        <Tooltip title="Add new chat">
          <img
            src={`${import.meta.env.BASE_URL}icons/plus.svg`}
            alt=""
            className="add"
            onClick={handleAddMore}
          />
        </Tooltip>
      </div>
      {filteredChats.map((chat) => (
        <Tooltip key={chat.id} title="Open chat" placement="bottom-start">
          <div className="item" style={{}} onClick={() => handleSelect(chat)}>
            <Badge badgeContent={badges.get(chat.id) || 0} color="error">
              <img
                src={`${import.meta.env.BASE_URL}icons/avatars/avatar-boy.svg`}
                alt=""
              />
            </Badge>
            <div className="texts">
              <span>{chat.name}</span>
              {/* <p>{chat.lastMessage}</p> */}
            </div>
          </div>
        </Tooltip>
      ))}
      {addMore && <AddChat open={addMore} setOpen={setAddMore} />}
    </div>
  );
}

const getChats = async () => {
  const { organisation } = useOrgStore.getState();
  try {
    const result = await API.get(`/organisations/${organisation?.id}/chats`);
    return result.data.chats;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(`Failed to get chats error message: ${error?.message}`, {
      position: "top-left",
    });
  }
};

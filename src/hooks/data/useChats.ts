
import { ChatEntity, FullChatEntity, MessageEntity } from "@/lib/entities";
import { backendFetch } from "@/utils/backendFetch";
import { create } from "zustand";
import { fetchStateData } from "./common";

interface ChatsState {
  chats: FullChatEntity[] | undefined,
  chatsError: boolean,
  createChat: (chatData: { name: string, agentId: number }) => Promise<number>,
  // setMessages: (chatId: number, messages: MessageEntity[]) => void,
  fetchMessagesError: boolean,
  fetchMessages: (chatId: number) => Promise<void>
}

export const useChats = create<ChatsState>((set, get) => ({
  chats: undefined,
  chatsError: false,
  createChat: (chatData) => {
    return backendFetch('/chat', {
      method: 'POST',
      body: JSON.stringify(chatData)
    })
      .then(res => res.json())
      .then(json => {
        const newChat = { ...(json as ChatEntity), messages: [] }

        set({ chats: ([newChat, ...get().chats ?? []]) })
        return newChat.chat_id
      })
      .catch(err => {
        console.error(`/chat\n${err}`)
        throw err
      })
  },
  // setMessages: (chatId, messages) => {
  //   const chat = get().chats?.find(c => c.chat_id === chatId)
  //   if (!chat) return

  //   chat.messages = messages

  //   set({ chats: updatedChats(get, chatId, chat) })
  // },
  fetchMessagesError: false,
  fetchMessages: (chatId) => {
    const chatData = get().chats?.find(c => c.chat_id === chatId)

    // if (chatData?.messages) {
    //   return Promise.resolve()
    // }

    return fetchStateData(
      `/chat/${chatId}/messages`,
      json => set({ chats: updatedChatWithMessages(get, chatId, json) }),
      err => set({ fetchMessagesError: true })
    )()
  }
}))

fetchStateData(
  '/chat',
  data => useChats.setState({ chats: data }),
  error => useChats.setState({ chatsError: error })
)()

const updatedChatWithMessages = (get: () => ChatsState, chatId: number, messages: MessageEntity[]): FullChatEntity[] | undefined => {
  return get().chats?.map(c => c.chat_id === chatId ? {
    agents: c.agents,
    chat_id: c.chat_id,
    name: c.name,
    user_id: c.user_id,
    messages: messages
  } : c)
}
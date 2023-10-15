import { ChatEntity } from "@/lib/entities"
import { backendFetch } from "@/utils/backendFetch"
import useSWR from "swr"
import { fetcher } from "./common"

export const useChats = () => {
  const {
    data: chats,
    isLoading,
    error,
    mutate,
  } = useSWR<ChatEntity[]>("/api/chat", fetcher)

  const createChat = async (chatData: { name: string; agentId: number }) => {
    return backendFetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(chatData),
    })
      .then(res => res.json())
      .then(json => {
        mutate([json, ...(chats ?? [])])
      })
  }

  return {
    chats,
    isLoading,
    error,
    createChat
  }
}
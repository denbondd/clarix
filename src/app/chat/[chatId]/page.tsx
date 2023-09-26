'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import useBackendFetch from "@/hooks/useBackendFetch"
import { FullChatEntity } from "@/lib/entities"
import { SendHorizonal } from "lucide-react"
import { useEffect, useRef } from "react"
import { useChat } from "ai/react"
import path from "path"

export default function Chat({ params }: { params: { chatId: string } }) {
  const { data: chatData, error, isLoading } = useBackendFetch<FullChatEntity>('/chat/' + params.chatId)
  useEffect(() => setMessages(chatData?.messages.map(msg => {
    return {
      id: msg.message_id.toString(),
      content: msg.content,
      role: msg.msg_roles.name as 'user' | 'assistant',
      createdAt: msg.created_at,
    }
  }) ?? []), [chatData])

  const { messages, setMessages, handleInputChange, input, handleSubmit } = useChat({
    api: path.join(process.env.NEXT_PUBLIC_BACKEND_URL ?? '', '/chat/') + params.chatId,
    id: params.chatId,
  })

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (messages && messages.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      })
    }
  }, [messages])

  return (
    <div className="flex-1">
      <ScrollArea className="h-[calc(100vh-120px)]">
        {messages.map(v =>
          <div className="mt-2 w-[50vw] rounded-md bg-slate-950 text-white p-4">
            {v.content}
          </div>)}
        <div ref={ref} />
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 mb-2 px-4">
        <Input
          className="py-6"
          placeholder="Send a message"
          value={input}
          onChange={handleInputChange}
        />
        <Button className="h-12 w-12 p-0" type="submit">
          <SendHorizonal size={20} />
        </Button>
      </form>
    </div>
  )
}

'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef } from "react"
import { useChat, useCompletion } from "ai/react"
import { useUser } from "@clerk/nextjs"
import type { UserResource } from '@clerk/types';
import WithLoading from "@/components/with-loading"
import Image from "next/image"
import { LogoIcon } from "@/components/ui/icons/icons"
// import { Message } from "ai"
import { useChats } from "@/hooks/data/useChats"
import PromptInput from "./prompt-input"
import { generalErrorToast } from "@/components/ui/use-toast"
import { useChatHelper } from "@/hooks/useChatHelper"
import { MessageEntity } from "@/lib/entities"

export default function Chat({ params }: { params: { chatId: string } }) {
  const chatId = Number.parseInt(params.chatId)

  const { user, isLoaded, isSignedIn } = useUser()
  // const fetchMessages = useChats((state) => state.fetchMessages)
  // const fetchMessagesError = useChats((state) => state.chatsError)
  // const chatData = useChats((state) => state.chats?.find(c => c.chat_id === chatId))

  // useEffect(() => {
  //   fetchMessages(chatId)
  // }, [chatId])

  // useEffect(() => {
  //   if (chatData && chatData.messages) {
  //     setMessages(chatData.messages.map(msg => {
  //       return {
  //         id: msg.message_id.toString(),
  //         content: msg.content,
  //         role: msg.msg_roles.name as 'user' | 'assistant',
  //         createdAt: new Date(msg.created_at,)
  //       }
  //     }))
  //   }
  // }, [chatData])

  // const { messages, setMessages, handleInputChange, input, handleSubmit, reload, stop, isLoading } = useChat({
  // const { completion, setCompletion, handleInputChange, input, handleSubmit, stop, isLoading } = useCompletion({
  //   api: process.env.NEXT_PUBLIC_BACKEND_URL + '/chat/' + params.chatId,
  //   onFinish: () => {
  //     // fetchMessages(chatId)
  //     console.log('finish')
  //   },
  //   onError: () => {
  //     generalErrorToast()
  //   }
  // })

  const { messages, handleReload, handleStop, handleSubmit, isLoading, handleInputChange, input } = useChatHelper({
    basePath: '/api/chat',
    chatId: chatId,
    onError: _ => generalErrorToast()
  })

  // useEffect(() => console.log(messages), [messages])

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    })
  }, [messages, params])

  return (
    <div className="relative flex h-full flex-col flex-flow">
      <ScrollArea className="h-[calc(100vh-200px)]">
        {/* <WithLoading data={user && chatData} error={!isSignedIn && fetchMessagesError} isLoading={!isLoaded && !chatData?.messages}> */}
        {/* <WithLoading data={user && chatData} error={!isSignedIn} isLoading={!isLoaded && !chatData?.messages}> */}
        <WithLoading data={messages && user} error={false}>
          {messages.map(msg => (
            <Message key={msg.message_id} msg={msg} user={user as UserResource} />
          ))}
          <div ref={ref} />
        </WithLoading>
      </ScrollArea>

      <PromptInput
        isLoading={isLoading}
        stop={handleStop}
        messages={messages}
        reload={handleReload}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  )
}

function Message({ msg, user }: { user: UserResource, msg: MessageEntity }) {
  return (
    <div className={"p-4 flex flex-col items-center w-full " + (msg.role === 'user' ? 'bg-background' : 'bg-secondary')}>
      <div className="max-w-5xl w-full">
        <div className="flex gap-4 items-start">
          <div className="flex-none rounded-md overflow-hidden sticky top-2">
            {msg.role === 'user' ?
              <Image
                src={user.imageUrl}
                alt="avatar"
                width={36}
                height={36}
              />
              :
              <div className="w-9 h-9 bg-primary flex items-center justify-center">
                <LogoIcon size={24} color="hsl(var(--primary-foreground))" />
              </div>
            }
          </div>
          {msg.content}
        </div>
        <div className="text-sm text-muted-foreground h-max">
          sources: {JSON.stringify(msg.msg_sources, null, 2)}
        </div>
      </div>
    </div>
  )
}
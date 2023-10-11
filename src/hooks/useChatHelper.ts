import { FullChatEntity, MessageEntity } from "@/lib/entities";
import { useChat as useAiChat, Message as AiMessage } from "ai/react";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { useChats } from "./data/useChats";
import useSWR, { KeyedMutator } from 'swr'

export type UseChatOptions = {
  basePath: string;
  chatId: number;
  onError?: (error: Error) => void;
}

export type UseChatHelpers = {
  messages: MessageEntity[];
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleReload: () => void;
  handleStop: () => void;
}

export function useChatHelper({
  basePath = '/api/chat',
  chatId,
  onError
}: UseChatOptions): UseChatHelpers {
  const api = `${basePath}/${chatId}`

  const chatData = useChats((state) => state.chats?.find(c => c.chat_id === chatId))
  const fetchMessages = useChats((state) => state.fetchMessages)

  const { data: messages, mutate: mutateMessages } = useSWR([basePath, chatId], {
    fallbackData: []
  })
  const stop = useRef(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')

  // Initial load
  useEffect(() => {
    if (!chatData?.messages)
      fetchMessages(chatId)
  }, [chatId])

  // To be up to date with cache
  useEffect(() => {
    if (chatData?.messages) {
      mutateMessages(chatData.messages)
    }
  }, [chatData?.messages])

  const getStreamedResponse = async (
    url: string,
    messages: MessageEntity[],
    mutateMessages: KeyedMutator<any>,
    stop: MutableRefObject<boolean>
  ) => {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        messages
      })
    })

    if (!res.ok)
      throw Error('Failed to fetch new message')
    if (!res.body)
      throw Error('The response body is empty')

    const decoder = new TextDecoder()
    const reader = res.body.getReader()

    const responseMessage: MessageEntity = {
      content: '',
      created_at: new Date(),
      message_id: -2,
      role: 'assistant',
      msg_sources: []
    }
    let streamedResponse = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done)
        break

      streamedResponse += decoder.decode(value)
      responseMessage.content = streamedResponse
      mutateMessages([...messages, { ...responseMessage }])

      if (stop.current) {
        reader.cancel()
        stop.current = false
        break
      }
    }
  }

  const submit = async (needToAppendInput: boolean) => {
    setIsLoading(true)
    const userInput = input
    setInput('')

    let msgsToUse: MessageEntity[]

    if (needToAppendInput) {
      const msgsWithInput = [...messages, {
        content: userInput,
        created_at: new Date(),
        message_id: -1,
        role: 'user',
        msg_sources: []
      }]
      mutateMessages(msgsWithInput)
      msgsToUse = msgsWithInput
    } else {
      msgsToUse = messages
    }

    try {
      await getStreamedResponse(
        api,
        msgsToUse,
        mutateMessages,
        stop
      )
    } catch (e) {
      console.error(e)
      if (onError && e instanceof Error)
        onError(e)
    }

    fetchMessages(chatId)
      .then(_ => setIsLoading(false))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submit(true)
  }

  const handleStop = () => {
    stop.current = true
  }

  const handleReload = () => {
    submit(false)
  }

  const handleInputChange = (e: any) => {
    setInput(e.target.value)
  }

  return {
    messages,
    input,
    handleInputChange,
    isLoading,
    handleSubmit,
    handleReload,
    handleStop
  }
}

const mapMessagesToAiMessagse = (messages: MessageEntity[]): AiMessage[] => messages.map(msg => {
  return {
    id: msg.message_id.toString(),
    content: msg.content,
    role: msg.role as "assistant" | "system" | "user",
    createdAt: msg.created_at
  }
})

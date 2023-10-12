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

  const { data: messages, mutate: mutateMessages } = useSWR<MessageEntity[]>([basePath, chatId], {
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

  const submit = async (messages: MessageEntity[] | undefined, needToAppendInput: boolean) => {
    setIsLoading(true)

    let msgsToUse: MessageEntity[] | undefined

    if (needToAppendInput) {
      const userInput = input
      setInput('')

      const msgsWithInput = [...messages ?? [], {
        content: userInput,
        created_at: new Date(),
        message_id: -1,
        role: 'user',
        msg_sources: []
      }] as MessageEntity[]
      mutateMessages(msgsWithInput)
      msgsToUse = msgsWithInput
    } else {
      msgsToUse = messages
    }

    console.log('sentMessages')
    console.log(msgsToUse)

    try {
      await getStreamedResponse(
        api,
        msgsToUse ?? [],
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
    submit(messages, true)
  }

  const handleStop = () => {
    stop.current = true
  }

  const handleReload = () => {
    let msgsToUse
    if (messages && messages[messages.length - 1].role === 'assistant') {
      msgsToUse = messages.slice(0, messages.length - 1)
      mutateMessages(msgsToUse)
    } else {
      msgsToUse = messages
    }
    submit(msgsToUse, false)
  }

  const handleInputChange = (e: any) => {
    setInput(e.target.value)
  }

  return {
    messages: messages ?? [],
    input,
    handleInputChange,
    isLoading,
    handleSubmit,
    handleReload,
    handleStop
  }
}

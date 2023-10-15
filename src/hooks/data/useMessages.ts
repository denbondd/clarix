import { MessageEntity } from "@/lib/entities"
import useSWR, { KeyedMutator } from "swr"
import { fetcher } from "./common"
import { MutableRefObject, useRef, useState } from "react"

export type UseMessagesHelpers = {
  messages: MessageEntity[]
  initialError: boolean
  initialIsLoading: boolean
  input: string
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void
  isLoading: boolean
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void
  reload: () => void
  stop: () => void
}

const getStreamedResponse = async (
  url: string,
  messages: MessageEntity[],
  mutateMessages: KeyedMutator<MessageEntity[]>,
  stopRef: MutableRefObject<boolean>
) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      messages,
    }),
  })

  if (!res.ok) throw Error("Failed to fetch new message")
  if (!res.body) throw Error("The response body is empty")

  const decoder = new TextDecoder()
  const reader = res.body.getReader()

  const responseMessage: MessageEntity = {
    content: "",
    created_at: new Date(),
    message_id: -2,
    role: "assistant",
    msg_sources: [],
  }
  let streamedResponse = ""

  while (true) {
    const { done, value } = await reader.read()

    if (done) break

    streamedResponse += decoder.decode(value)
    responseMessage.content = streamedResponse
    mutateMessages([...messages, { ...responseMessage }])

    if (stopRef.current) {
      reader.cancel()
      stopRef.current = false
      break
    }
  }
}

export const useMessages = (
  chatId: number,
  onError?: (err: Error) => void
): UseMessagesHelpers => {
  const api = `/api/chat/${chatId}`
  const messagesApi = `/api/chat/${chatId}/messages`

  // hook to fetch messages with sources from database
  const {
    data: initialMessages,
    error: initialError,
    isLoading: initialIsLoading,
    mutate: refetch,
  } = useSWR(messagesApi, fetcher)

  // hook that keeps track of displayed data
  const { data: messages, mutate } = useSWR<MessageEntity[]>(
    `msgs-${chatId}`,
    null,
    {
      fallbackData: initialMessages
    }
  )

  const stopRef = useRef(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>("")

  const handleInputChange = (e: any) => {
    setInput(e.target.value)
  }

  const triggerRequest = async (msgs: MessageEntity[]) => {
    setIsLoading(true)
    mutate(msgs)
    try {
      await getStreamedResponse(api, msgs, mutate, stopRef)
    } catch (err) {
      console.error({ api, err })
      if (onError && err instanceof Error) onError(err)
    } finally {
      setIsLoading(false)
      mutate(refetch())
    }
  }

  const stop = () => {
    stopRef.current = true
  }

  const handleSubmit = (e: any) => {
    e?.preventDefault()

    const newMsg: MessageEntity = {
      message_id: -1,
      role: "user",
      created_at: new Date(),
      content: input,
      msg_sources: [],
    }
    setInput("")

    triggerRequest([...(messages ?? []), newMsg])
  }

  const reload = () => {
    if (messages && messages[messages?.length - 1].role === "assistant")
      triggerRequest(messages.slice(0, -1))
    else triggerRequest(messages ?? [])
  }

  return {
    messages: messages || [],
    initialError,
    initialIsLoading,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    reload,
    stop,
  }
}

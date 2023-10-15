"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react"
import WithLoading from "@/components/with-loading"
import PromptInput from "./prompt-input"
import { generalErrorToast } from "@/components/ui/use-toast"
import Message from "./message"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { File } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { MessageEntity, MessageSource } from "@/lib/entities"
import { useMessages } from "@/hooks/data/useMessages"

export default function Chat({ params }: { params: { chatId: string } }) {
  const chatId = Number.parseInt(params.chatId)

  const {
    messages,
    initialError,
    initialIsLoading,
    reload,
    stop,
    handleSubmit,
    isLoading,
    handleInputChange,
    input,
  } = useMessages(chatId, _ => generalErrorToast())

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const [openedContextData, setOpenedContextData] = useState<{
    msg?: MessageEntity
    src?: MessageSource
  }>()
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push(pathname)
    }
    setOpen(open)
  }
  useEffect(() => {
    const msgIdStr = searchParams.get("msg")
    const srcIdStr = searchParams.get("src")

    if (msgIdStr && srcIdStr) {
      const msgId = Number.parseInt(msgIdStr)
      const srcId = Number.parseInt(srcIdStr)

      const msg = messages.find(m => m.message_id === msgId)
      const src = msg?.msg_sources.find(s => s.embedding_id === srcId)

      setOpenedContextData({ msg, src })
      setOpen(true)
    }
  }, [searchParams, messages])

  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [messages])
  return (
    <div className="relative flex h-full flex-col flex-flow">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <WithLoading
          data={messages}
          isLoading={initialIsLoading}
          error={initialError}
        >
          {messages.map(msg => (
            <Message key={msg.message_id} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </WithLoading>
      </ScrollArea>

      <PromptInput
        isLoading={isLoading}
        stop={stop}
        messages={messages}
        reload={reload}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Sources</DialogTitle>
            <DialogDescription className="line-clamp-2">
              Answer: {openedContextData?.msg?.content}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-2">
              {openedContextData?.msg?.msg_sources.map(s => (
                <Link
                  href={
                    pathname +
                    "?" +
                    new URLSearchParams([
                      ["msg", openedContextData?.msg?.message_id.toString() ?? ""],
                      ["src", s.embedding_id.toString()],
                    ])
                  }
                  key={s.embedding_id}
                >
                  <Card
                    className={
                      "relative rounded-sm overflow-hidden py-2 px-4" +
                      (openedContextData?.src?.embedding_id === s.embedding_id
                        ? " ring-2 ring-ring ring-offset-1 ring-opacity-50"
                        : "")
                    }
                  >
                    <Progress
                      value={s.similarity * 100}
                      className="rounded-none w-full h-full absolute z-0 left-0 top-0"
                    />
                    <div className="z-10 relative flex justify-between items-center">
                      <div
                        className={
                          "flex flex-col gap-1 text-primary-foreground" +
                          (openedContextData?.src?.embedding_id === s.embedding_id
                            ? ""
                            : " opacity-80")
                        }
                      >
                        <div>{s.file.name}</div>
                        <div className="text-sm">{s.folder.name}</div>
                      </div>
                      <div>{Math.round(s.similarity * 100)}%</div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="col-span-2">
              <Card className="h-full flex flex-col">
                <div className="m-4 flex flex-row gap-1">
                  <File className="mr-1" />
                  <Link href={`/kb/${openedContextData?.src?.folder.id}`}>
                    {openedContextData?.src?.folder.name}
                  </Link>
                  /
                  <Link
                    href={`/kb/${openedContextData?.src?.folder.id}/${openedContextData?.src?.file.id}`}
                  >
                    {openedContextData?.src?.file.name}
                  </Link>
                </div>
                <Separator />
                <div className="m-4 flex flex-col flex-1 gap-2 justify-between">
                  <TextPlaceholder />
                  {openedContextData?.src?.content}
                  <TextPlaceholder />
                </div>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const TextPlaceholder = () => (
  <div className="flex flex-col gap-2 overflow-hidden w-full h-max">
    {Array(3)
      .fill(null)
      .map((_, index) => (
        <div className="flex items-center gap-1" key={index}>
          {Array(2 + Math.round(Math.random() * 3))
            .fill(null)
            .map((_, subIndex) => (
              <div
                className="bg-muted rounded-md h-3 flex-grow"
                style={{ width: `${20 + Math.random() * 40}%` }}
                key={subIndex}
              ></div>
            ))}
        </div>
      ))}
  </div>
)

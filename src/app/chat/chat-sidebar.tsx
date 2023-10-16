"use client"

import { LoadingButton } from "@/components/loading-button"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { generalErrorToast } from "@/components/ui/use-toast"
import WithLoading from "@/components/with-loading"
import { useAgents } from "@/hooks/data/useAgents"
import { useChats } from "@/hooks/data/useChats"
import { useSearch } from "@/hooks/useSearch"

import { ChatEntity } from "@/lib/entities"
import { zodResolver } from "@hookform/resolvers/zod"
import { MessageSquarePlus } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

export default function ChatSidebar() {
  const { chats, isLoading, error, createChat } = useChats()
  const { agents } = useAgents()

  const router = useRouter()

  const path = usePathname()
  const [currentChatId, setCurrentChatId] = useState(-1)
  useEffect(() => {
    const pathParts = path.split("/")
    setCurrentChatId(pathParts.length == 2 ? -1 : Number.parseInt(pathParts[2]))
  }, [path])

  const [isAddBtnLoading, setIsAddBtnLoading] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const {
    filteredData: filteredChats,
    handleSearchInputChange,
    searchInput,
  } = useSearch(chats)

  const handleChatCreate = (values: z.infer<typeof createChatSchema>) => {
    setIsAddBtnLoading(true)
    createChat(values)
      .then(newChat => {
        setIsAddDialogOpen(false)
        router.push("/chat/" + newChat.chat_id)
      })
      .catch(_ => {
        generalErrorToast()
      })
      .finally(() => setIsAddBtnLoading(false))
  }

  const createChatSchema = z.object({
    name: z
      .string({ required_error: "Folder name is required" })
      .min(3, { message: "Folder name must me at least 3 characters" })
      .max(60, { message: "Too long for a folder name, try something shorter" })
      .refine(name => !chats?.find(f => f.name == name), {
        message: "Chat with this name already exists",
      }),
    agentId: z.number({ required_error: "Agent is required" }),
  })

  const form = useForm<z.infer<typeof createChatSchema>>({
    resolver: zodResolver(createChatSchema),
  })

  return (
    <Sidebar className="w-[20rem]">
      <div className="flex w-full gap-1 items-center mb-4">
        <Input
          placeholder="Search chat"
          value={searchInput}
          onChange={handleSearchInputChange}
        />

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="flex-none">
              <MessageSquarePlus size={22} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Chat</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleChatCreate)}
                id="createFolderForm"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chat name</FormLabel>
                      <FormControl>
                        <Input placeholder="Chat name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="agentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent</FormLabel>
                      <FormControl>
                        <div>
                          <Combobox
                            btnTriggerText="Select Agent"
                            elements={
                              agents?.map(ag => {
                                return {
                                  value: ag.agent_id.toString(),
                                  label: ag.name,
                                }
                              }) ?? []
                            }
                            noFoundText="No Agent found"
                            value={field.value?.toString()}
                            onValueChange={v =>
                              form.setValue("agentId", Number.parseInt(v))
                            }
                            placeholder="Select Agent"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <DialogFooter className="mt-4">
              <DialogTrigger asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogTrigger>
              <LoadingButton
                isLoading={isAddBtnLoading}
                type="submit"
                form="createFolderForm"
              >
                Create
              </LoadingButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <WithLoading data={chats} isLoading={isLoading} error={error}>
        <div className="flex flex-col gap-2">
          {filteredChats?.map((c, idx) => (
            <Chat chat={c} key={idx} currentChatId={currentChatId} />
          ))}
        </div>
      </WithLoading>
    </Sidebar>
  )
}

function Chat({
  chat,
  currentChatId,
}: {
  chat: ChatEntity
  currentChatId: number
}) {
  return (
    <Button
      asChild
      variant={chat.chat_id === currentChatId ? "secondary" : "outline"}
      className="justify-between"
    >
      <Link href={`/chat/${chat.chat_id}`}>{chat.name}</Link>
    </Button>
  )
}

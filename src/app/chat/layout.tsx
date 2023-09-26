'use client'

import { LoadingButton } from "@/components/loading-button";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { generalErrorToast } from "@/components/ui/use-toast";
import WithLoading from "@/components/with-loading";

import useBackendFetch from "@/hooks/useBackendFetch";
import { AgentEntity, ChatEntity } from "@/lib/entities";
import { backendFetch } from "@/utils/backendFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'

export default function ChatLayout(props: { children: React.ReactNode }) {
  const { data: allChats, setData: setAllChats, error: allChatsError, isLoading: isAllChatsLoading } =
    useBackendFetch<ChatEntity[]>('/chat')
  const { data: agents } = useBackendFetch<AgentEntity[]>('/agents')

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [searchChatName, setSearchChatName] = useState('')
  const [chats, setChats] = useState<ChatEntity[]>()

  useEffect(() => setChats(allChats), [allChats])
  useEffect(() => {
    if (!searchChatName)
      setChats(allChats)
    else
      setChats(allChats?.filter(c => c.name.toLowerCase().includes(searchChatName.toLowerCase())))
  }, [searchChatName])

  const handleChatCreate = (values: z.infer<typeof createChatSchema>) => {
    setIsLoading(true)
    backendFetch('/chat', {
      method: 'POST',
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(json => {
        const newChat = json as ChatEntity
        setSearchChatName('')
        setAllChats([newChat, ...allChats ?? []])
        setIsOpen(false)
        router.push('/chat/' + newChat.chat_id)
      })
      .catch(err => {
        generalErrorToast()
        console.error(`/chat\n${err}`)
      })
      .finally(() => setIsLoading(false))
  }

  const createChatSchema = z.object({
    name: z.string({ required_error: 'Folder name is required' })
      .min(3, { message: 'Folder name must me at least 3 characters' })
      .max(60, { message: 'Too long for a folder name, try something shorter' })
      .refine(
        name => !chats?.find(f => f.name == name),
        { message: 'Chat with this name already exists' }
      ),
    agentId: z.number({ required_error: 'Agent is required' })
  })

  const form = useForm<z.infer<typeof createChatSchema>>({
    resolver: zodResolver(createChatSchema),
  })

  return (
    <div className="flex w-full h-full">
      <Sidebar className=" max-w-xs">
        <div className="flex w-full gap-1 items-center mb-4">
          <Input
            placeholder="Search chat"
            value={searchChatName}
            onChange={(inp) => setSearchChatName(inp.target.value)}
          />

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size='icon' className="flex-none">
                <MessageSquarePlus size={22} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Create Chat
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleChatCreate)} id="createFolderForm">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Chat name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Chat name' {...field} />
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
                        <FormLabel>
                          Agent
                        </FormLabel>
                        <FormControl>
                          <div>
                            <Combobox
                              btnTriggerText="Select Agent"
                              elements={agents?.map(ag => {
                                return {
                                  value: ag.agent_id.toString(),
                                  label: ag.name
                                }
                              }) ?? []}
                              noFoundText="No Agent found"
                              value={field.value?.toString()}
                              onValueChange={v => form.setValue('agentId', Number.parseInt(v))}
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
                  <Button variant='secondary' >
                    Cancel
                  </Button>
                </DialogTrigger>
                <LoadingButton isLoading={isLoading} type="submit" form="createFolderForm">
                  Create
                </LoadingButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <WithLoading data={allChats} isLoading={isAllChatsLoading} error={allChatsError}>
          <div className="flex flex-col gap-2">
            {chats?.map((c, idx) => (
              <Button asChild variant='outline' className="justify-start" key={idx}>
                <a href={`/chat/${c.chat_id}`}>{c.name}</a>
              </Button>
            ))}
          </div>
        </WithLoading>
      </Sidebar>
      <div className="max-w-6xl w-full mx-auto">
        {props.children}
      </div>
    </div>
  )
}

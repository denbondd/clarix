'use client'

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { ComboboxMultiselect } from "@/components/ui/combobox-multiselect";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { AgentEntity, ModelEntity } from "@/lib/entities";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'

export interface AgentParams {
  name: string;
  folderIds: [number, ...number[]];
  modelId: number;
  systemPrompt: string;
  temperature: number;
  description?: string | undefined;
}

interface EditAgentDialogContentProps {
  type: 'create' | 'edit',
  agent?: AgentEntity,
  folders?: {
    folder_id: number,
    name: string
  }[],
  tookNames: string[],
  models?: ModelEntity[],
  onSubmit: (values: AgentParams) => Promise<void>,
}

const defaultValues = {
  systemPrompt: 'You are Clarix, AI Assistant...',
  temperature: 17
}

export default function EditAgentDialogContent(props: EditAgentDialogContentProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (values: z.infer<typeof agentSchema>) => {
    setIsLoading(true)
    props.onSubmit(values)
      .finally(() => {
        setIsLoading(false)
        form.reset()
      })
  }

  useEffect(() => {
    const agent = props.agent
    if (agent)
      form.reset({
        name: agent.name,
        description: agent.description,
        folderIds: agent.agent_has_folders.map(v => v.folder_id),
        modelId: agent.models.model_id,
        systemPrompt: agent.system_prompt,
        temperature: agent.temperature
      })
  }, [props.agent])

  const agentSchema = z.object({
    name: z.string({ required_error: 'Agent name is required' })
      .min(3, { message: 'Agent name must me at least 3 characters' })
      .max(60, { message: 'Too long for an agent name, try something shorter' })
      .refine(
        name => props.agent?.name === name || !props.tookNames?.find(a => a === name),
        { message: 'Agent with this name already exists' }
      ),
    description: z.string().optional(),
    folderIds: z.array(z.number()).nonempty('Agent must know at least one folder'),
    modelId: z.number().min(0).max(20),
    systemPrompt: z.string(),
    temperature: z.number()
  })

  const form = useForm<z.infer<typeof agentSchema>>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      temperature: defaultValues.temperature,
      systemPrompt: defaultValues.systemPrompt
    }
  })

  const action = props.type === 'create' ? 'Create' : 'Edit'
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {action} Agent
        </DialogTitle>
        <DialogDescription>
          Configure your new Agent for your needs. You can edit all parameters later if you wish
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-[60vh]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} id="agentForm">
            <div className="flex flex-col gap-2">
              <Separator />
              <div className="flex gap-2 items-center">
                <div className="font-semibold">
                  Private parameters
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm">
                    {"These parameters are solely for Agent's identification. They will not" +
                      "affect your agent's behaviour and only you will see it"}
                  </TooltipContent>
                </Tooltip>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />
              <div className="flex gap-2 items-center">
                <div className="font-semibold">
                  Behavioral parameters
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={18} />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    {"These parameters will affect your agent's behaviour"}
                  </TooltipContent>
                </Tooltip>
              </div>

              <FormField
                control={form.control}
                name="folderIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folders, which Agent will know</FormLabel>
                    <FormControl>
                      <ComboboxMultiselect<number>
                        elements={props.folders?.map(f => {
                          return {
                            value: f.folder_id,
                            label: f.name
                          }
                        }) ?? []}
                        btnTriggerText="Select folders"
                        noFoundText="Folder not found"
                        placeholder="Select folders..."
                        allSelectedText="You selected all your folders"
                        onSelectedChange={values => form.setValue("folderIds", values as [number, ...number[]])}
                        selectedValues={field.value ?? []}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Select
                        value={props.models?.find(m => m.model_id === field.value)?.model_id.toString()}
                        onValueChange={value => form.setValue('modelId', Number.parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={<div className="text-muted-foreground">AI model...</div>} />
                        </SelectTrigger>
                        <SelectContent>
                          {props.models?.map(m => (
                            <SelectItem
                              key={m.model_id}
                              value={m.model_id.toString()}
                            >
                              {m.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt</FormLabel>
                    <FormControl>
                      <Textarea placeholder="System Prompt..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex gap-2 items-center mb-2">
                        <Label>Temperature</Label>
                        {field.value / 10}
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        value={[field.value]}
                        onValueChange={v => form.setValue('temperature', v[0])}
                        max={20}
                        step={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </form>
        </Form>
      </ScrollArea>
      <DialogFooter>
        <DialogTrigger asChild>
          <Button variant='secondary'>
            Cancel
          </Button>
        </DialogTrigger>
        <LoadingButton type="submit" form="agentForm" isLoading={isLoading}>
          {action}
        </LoadingButton>
      </DialogFooter>
    </DialogContent>
  )
}
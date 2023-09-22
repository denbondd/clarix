'use client'

import { LabeledInput, LabeledTextarea } from "@/components/labeled-inputs";
import { Button } from "@/components/ui/button";
import { ComboboxMultiselect } from "@/components/ui/combobox-multiselect";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface EditAgentDialogContentProps {
  type: 'create' | 'edit',
  folders: {
    folder_id: number,
    name: string
  }[],
  models: {
    name: string
  }[]
}

export default function EditAgentDialogContent(props: EditAgentDialogContentProps) {
  const [temp, setTemp] = useState(1)

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
      <ScrollArea className="h-[65vh]">
        <div className="flex flex-col gap-2">
          <Separator />
          <div className="flex flex-col gap-2">
            <div>
              <div className="font-semibold">
                Private parameters
              </div>
              <div className="text-sm text-muted-foreground">
                These parameters are solely for Agent's identification. They will not
                affect your agent's behaviour and only you will see it
              </div>
            </div>
            <LabeledInput
              label="Name:"
              placeholder="Input agent's name..."
            />
            <LabeledTextarea
              label="Description"
              placeholder="Input agent's description"
            />
          </div>
          <Separator />
          <div>
            <div className="font-semibold">
              Behavioral parameters
            </div>
            <div className="text-sm text-muted-foreground">
              These parameters will affect your agent's behaviour
            </div>
          </div>
          <Label>Folders, which Agent will know:</Label>
          <ComboboxMultiselect
            elements={props.folders.map(f => {
              return {
                value: f.folder_id.toString(),
                label: f.name
              }
            })}
            btnTriggerText="Select folder"
            noFoundText="Folder not found"
            placeholder="Select folder..."
            allSelectedText="You selected all your folders"
          />

          <Label>Model</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={<div className="text-muted-foreground">Select AI model...</div>} />
            </SelectTrigger>
            <SelectContent>
              {props.models.map(m => (
                <SelectItem
                  key={m.name}
                  value={m.name}
                >
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <LabeledTextarea
            label="System Prompt"
            defaultValue='You are Clarix, AI Assistant...'
          />

          <div className="flex gap-2 items-center">
            <Label>Temperature</Label>
            {temp}
          </div>
          <Slider value={[temp]} onValueChange={v => setTemp(v[0])} max={2} step={0.1} />
        </div>
      </ScrollArea>
      <DialogFooter>
        <DialogTrigger asChild>
          <Button variant='secondary'>
            Cancel
          </Button>
        </DialogTrigger>
        <Button>
          {action}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
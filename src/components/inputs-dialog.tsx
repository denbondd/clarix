'use client'

import { useState } from "react";

import { DialogHeader, DialogTitle, DialogContent, DialogFooter, Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Label } from "./ui/label";
import { DialogProps } from "@radix-ui/react-dialog"

export type InputsDialogValues = Record<string, string>

export interface InputsDialogProps {
  children: React.ReactNode,
  title?: string,
  submitBtnText: string,
  inputs?: {
    name: string,
    placeholder: string,
    defValue?: string,
    label?: string,
    size?: number
  }[]
  onSubmit: (values?: InputsDialogValues) => Promise<void>,
  asChild?: boolean,
  isDestructive?: boolean,
  description?: string,
  dialogProps?: DialogProps
}

export default function InputsDialog(props: InputsDialogProps) {
  const [isAddBtnLoading, setIsAddBtnLoading] = useState(false)
  const inputs: {
    name: string,
    placeholder: string,
    defValue?: string,
    label?: string,
    size?: number
  }[] = props.inputs ?? Array()
  const valuesStates = inputs.map((_, idx) => useState<string>(inputs[idx].defValue ?? ''))

  const handleAddFolder = () => {
    setIsAddBtnLoading(true)
    props.onSubmit(inputs.reduce(
      (acc, { name }, idx) => {
        acc[name] = valuesStates[idx][0];
        return acc;
      },
      {} as InputsDialogValues
    ))
      .finally(() => setIsAddBtnLoading(false))
  }

  return (
    <Dialog {...props.dialogProps}>
      <DialogTrigger asChild={props.asChild}>
        {props.children}
      </DialogTrigger>
      <DialogContent>
        {props.title && (
          <DialogHeader>
            <DialogTitle>
              {props.title}
            </DialogTitle>
          </DialogHeader>
        )}
        {props.description ?? ''}
        {inputs.map((inp, idx) => (
          <div key={idx}>
            {inp.label && <Label>{inp.label}</Label>}
            <Input
              placeholder={inp.placeholder}
              value={valuesStates[idx][0]}
              onChange={(v) => valuesStates[idx][1](v.target.value)}
              size={inp.size ?? 2}
              key={idx}
            />
          </div>
        ))}
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant='secondary'>
              Cancel
            </Button>
          </DialogTrigger>
          <Button
            onClick={handleAddFolder}
            disabled={isAddBtnLoading}
            variant={props.isDestructive ? 'destructive' : 'default'}
          >
            {isAddBtnLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {props.submitBtnText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
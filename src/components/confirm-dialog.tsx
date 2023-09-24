'use client'

import { useState } from "react";

import { DialogHeader, DialogTitle, DialogContent, DialogFooter, Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DialogProps } from "@radix-ui/react-dialog"

export interface ConfirmDialogProps {
  children: React.ReactNode,
  title?: string,
  confirmBtnText: string,
  onSubmit: () => Promise<void>,
  asChild?: boolean,
  isDestructive?: boolean,
  description?: string,
  dialogProps?: DialogProps
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const [isAddBtnLoading, setIsAddBtnLoading] = useState(false)

  const handleAddFolder = () => {
    setIsAddBtnLoading(true)
    props.onSubmit()
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
            {props.confirmBtnText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
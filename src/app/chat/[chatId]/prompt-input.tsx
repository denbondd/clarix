'use client'

import { UseChatHelpers } from "ai/react"

import { Button } from "@/components/ui/button"
import Textarea from 'react-textarea-autosize'
import { Ban, Loader2, Octagon, RefreshCw, SendHorizonal } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useEnterSubmit } from "@/hooks/useEnterSubmit"
import { MessageEntity } from "@/lib/entities"

interface PromptInputProps extends Pick<
  UseChatHelpers,
  'handleSubmit'
  | 'handleInputChange'
  | 'input'
  | 'isLoading'
  | 'stop'
> {
  messages: MessageEntity[];
  reload: () => void;
}

export default function PromptInput({ isLoading, messages, stop, reload, input, handleInputChange, handleSubmit }: PromptInputProps) {
  const { formRef, onKeyDown } = useEnterSubmit()

  return (
    <div className="bg-gradient-to-t from-background via-background via-70% pt-2 absolute bottom-0 flex-1 w-full flex flex-col items-end">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mx-2">
          <div className="flex justify-between">
            <div />
            {isLoading && (
              <Button
                variant='outline'
                className="flex gap-2"
                onClick={() => stop()}
              >
                <Ban size={16} />
                Stop generating
              </Button>
            )}
            {!isLoading && messages.length > 0 && (
              <Button
                variant='outline'
                className="flex gap-2"
                onClick={() => reload()}
              >
                <RefreshCw size={16} />
                Regenerate
              </Button>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="rounded-md bg-muted h-max w-full flex items-end my-2 px-2"
            ref={formRef}
          >
            <Textarea
              tabIndex={0}
              rows={1}
              maxRows={5}
              value={input}
              onChange={handleInputChange}
              placeholder="Send a message..."
              onKeyDown={onKeyDown}
              spellCheck={false}
              className="min-h-[56px] w-full resize-none bg-transparent px-2 py-[1.2rem] focus-within:outline-none"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button
                    type="submit"
                    size='icon'
                    disabled={isLoading || input.length === 0}
                    className="transition duration-200 my-2"
                  >
                    {isLoading && <Loader2 size={20} className="animate-spin" />}
                    {!isLoading && <SendHorizonal size={20} />}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </form>
        </div>
      </div>
    </div>
  )
}
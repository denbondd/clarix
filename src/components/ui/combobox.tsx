"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

export interface ComboboxProps {
  value: string,
  onValueChange: (v: string) => void,
  placeholder: string,
  btnTriggerText: string,
  noFoundText: string,
  elements: {
    value: string,
    label: string
  }[]
}

export function Combobox(props: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {props.value
            ? props.elements.find((elem) => elem.value === props.value)?.label
            : props.btnTriggerText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search) => {
            if (props.elements.find((elem) => elem.value === value)?.label.includes(search)) return 1
            return 0
          }}
        >
          <CommandInput placeholder={props.placeholder} />
          <CommandEmpty>{props.noFoundText}</CommandEmpty>
          <CommandGroup>
            {props.elements.map((elem) => (
              <CommandItem
                key={elem.value}
                value={elem.value}
                onSelect={(currentValue) => {
                  props.onValueChange(currentValue === props.value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    props.value === elem.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {elem.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

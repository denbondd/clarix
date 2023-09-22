"use client"

import * as React from "react"
import { X } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command"
import { Command as CommandPrimitive } from "cmdk";
import { Badge } from "./badge"

interface Element {
  value: string,
  label: string
}

export interface ComboboxProps {
  placeholder: string,
  btnTriggerText: string,
  noFoundText: string,
  allSelectedText: string,
  elements: Element[]
}

export function ComboboxMultiselect(props: ComboboxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Element[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((elem: Element) => {
    setSelected(prev => prev.filter(s => s.value !== elem.value));
  }, []);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected(prev => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          })
        }
      }

      if (e.key === "Escape") {
        e.preventDefault()
        input.blur();
      }
    }
  }, []);

  const selectables = props.elements.filter(elem => !selected.includes(elem));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div
        className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <div className="flex gap-1 flex-wrap">
          {selected.map((elem) => {
            return (
              <Badge key={elem.value}>
                {elem.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(elem);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(elem)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length > 0 ? '' : props.btnTriggerText}
            className="bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <div
          style={{
            transform: !open ? 'scale(0.95) translateY(-10px)' : 'scale(1)',
            opacity: !open ? "0" : "1",
            transition: "all .15s ease-in-out",
            visibility: !open ? "hidden" : "visible",
          }}
          className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
        >
          <CommandEmpty>{selected.length > 0 ? props.allSelectedText : props.noFoundText}</CommandEmpty>
          <CommandGroup className="h-full overflow-auto">
            {selectables.map((elem) => {
              return (
                <CommandItem
                  key={elem.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onSelect={(value) => {
                    setInputValue("")
                    setSelected(prev => [...prev, elem])
                  }}
                  className={"cursor-pointer"}
                >
                  {elem.label}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </div>
      </div>
    </Command >
  )
}
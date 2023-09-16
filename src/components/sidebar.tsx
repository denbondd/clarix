import { ScrollArea } from "./ui/scroll-area";

export default function Sidebar(props: { children: React.ReactNode }) {
  return (
    <ScrollArea aria-orientation="vertical" className="h-[calc(100vh-60px)] p-2 border-r-solid border-r-secondary border-r-2">
      {props.children}
    </ScrollArea>
  )
}
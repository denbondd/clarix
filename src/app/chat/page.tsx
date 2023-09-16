import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendHorizonal } from "lucide-react"

interface Message {
  content: string,
  isInbound: boolean,
  date: Date
}

const messages: Message[] = [
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: true,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: false,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: true,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: false,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: true,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: false,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: true,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: false,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: true,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: false,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: true,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: false,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: true,
    date: new Date()
  },
  {
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis velit cursus mi tincidunt, non eleifend arcu lobortis. ',
    isInbound: false,
    date: new Date()
  },
]

export default function Chat() {
  return (
    <div className="flex-1">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="flex flex-col gap-3 mx-5">
          {/* <div className="flex flex-col gap-3 h-[88vh] overflow-y-auto"> */}
          {messages.map((v, idx) => (
            <div className={idx == 0 ? 'mt-4' : idx == (messages.length - 1) ? 'mb-4' : ''}>
              <Message msg={v} key={idx} />
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex w-full items-center gap-2 mb-2 px-4">
        <Input className="py-6" placeholder="Send a message" />
        <Button className="h-12 w-12 p-0"><SendHorizonal size={20} /></Button>
      </div>
    </div>
  )
}

function Message(props: { msg: Message }) {
  // const dateStr = props.msg.date.toLocaleDateString('en-us', { month: "short", day: "numeric", year: "numeric" })
  const rootClassDef = ' w-fit rounded-t-2xl p-3 flex flex-col gap-1'
  return (
    <div className={(props.msg.isInbound ? 'mr-3' : 'ml-3')}>
      <div className={(props.msg.isInbound ? 'bg-accent rounded-br-2xl mr-auto' : 'border-solid border rounded-bl-2xl ml-auto') + rootClassDef}>
        {props.msg.content}
        {/* <div className="text-xs text-muted-foreground text-right">
        {dateStr}
      </div> */}
      </div>
    </div>
  )
}
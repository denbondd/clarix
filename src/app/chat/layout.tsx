import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquarePlus } from "lucide-react";

const chats = [
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
  'chat1', 'chat2', 'chat3',
]

export default function ChatLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-full">
      <Sidebar>
        <div className="flex w-full max-w-sm items-center gap-1 mb-4">
          <Input placeholder="Search chat" />
          <Button className="w-12 p-0">
            <MessageSquarePlus size={22} />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {chats.map((c, idx) => (
            <Button asChild variant='outline' className="justify-start" key={idx}>
              <a href={c}>{c}</a>
            </Button>
          ))}
        </div>
      </Sidebar>
      <div className="max-w-6xl w-full mx-auto">
        {props.children}
      </div>
    </div>
  )
}

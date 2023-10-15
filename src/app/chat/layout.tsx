import { Metadata } from "next"
import ChatSidebar from "./chat-sidebar"

export const metadata: Metadata = {
  title: "Chat | Clarix",
}

export default function ChatLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-full">
      <ChatSidebar />
      <div className="w-full mx-auto">{props.children}</div>
    </div>
  )
}

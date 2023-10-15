import { Metadata } from "next";
import KbSidebar from "./kb-sidebar"

export const metadata: Metadata = {
  title: "Knowledge Base | Clarix",
}

export default function KbLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-full">
      <KbSidebar />
      <div className="max-w-6xl w-full mx-auto">{props.children}</div>
    </div>
  )
}

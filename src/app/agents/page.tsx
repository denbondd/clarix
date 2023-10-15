import { Metadata } from "next"
import AgentsContent from "./agents-content"

export const metadata: Metadata = {
  title: "Agents | Clarix",
}

export default function Agents() {
  return (
    <AgentsContent />
  )
}

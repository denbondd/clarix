import { ArrowLeft } from "lucide-react";

export default function Kb() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 text-lg text-muted-foreground">
      <ArrowLeft className="animate-bounce-horizontal" strokeWidth={1.75} />
      Select a folder
    </div>
  )
}
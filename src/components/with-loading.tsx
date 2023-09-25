import { AlertCircle, Loader2 } from "lucide-react"

interface WithLoadingProps {
  data: any,
  isLoading: boolean,
  error: boolean,
  children: React.ReactNode
}

export default function WithLoading(props: WithLoadingProps) {
  if (props.isLoading) return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <Loader2 size={48} className="mt-4 animate-spin" />
    </div>
  )
  if (props.error) return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4 fill-destructive">
      <AlertCircle size={48} strokeWidth={1.75} />
      <div className="text-destructive-foreground text-2xl font-semibold">
        Something went wrong(. Please, try again later
      </div>
    </div>
  )
  if (props.data) return (
    props.children
  )
}
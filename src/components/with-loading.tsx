import { AlertCircle, Loader2 } from "lucide-react"

interface WithLoadingProps {
  data: any,
  isLoading?: boolean,
  error: boolean,
  children: React.ReactNode,
  className?: string
}

export default function WithLoading(props: WithLoadingProps) {
  if (props.error) return (
    <div className={props.className ?? '' + "w-full h-full flex flex-col justify-center items-center gap-2 fill-destructive"}>
      <AlertCircle size={48} strokeWidth={1.75} />
      <div className="text-destructive text-xl font-semibold text-center">
        Something went wrong(. Please, try again later
      </div>
    </div>
  )
  if (props.isLoading || !props.data) return (
    <div className={props.className ?? '' + " w-full h-full flex flex-col justify-center items-center"}>
      <Loader2 size={48} className="mt-4 animate-spin" />
    </div>
  )
  if (props.data) return (
    <div>
      {props.children}
    </div>
  )
}
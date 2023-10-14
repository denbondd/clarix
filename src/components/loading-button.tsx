import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean
}

export function LoadingButton(props: LoadingButtonProps) {
  return (
    <Button
      disabled={props.isLoading}
      {...props}
    >
      {props.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {props.children}
    </Button>
  )
}
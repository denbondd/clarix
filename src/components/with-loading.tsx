interface WithLoadingProps {
  data: any,
  isLoading: boolean,
  error: boolean
}

export default function WithLoading(props: { loader: WithLoadingProps, children: React.ReactNode }) {
  if (props.loader.isLoading) return (
    <div>

    </div>
  )
  if (props.loader.error) return (
    <div>

    </div>
  )
  if (props.loader.data) return (
    props.children
  )
}
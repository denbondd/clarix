import { backendFetch } from "@/utils/backendFetch"

export const fetchStateData = (
  path: string,
  setSuccess: (json: any) => void,
  setError: (error: boolean) => void
) => {
  return async () => {
    backendFetch(path)
      .then(res => res.json())
      .then(json => setSuccess(json))
      .catch(err => {
        if (typeof window !== 'undefined') {
          setError(true)
          console.error(err)
        }
      })
  }
}

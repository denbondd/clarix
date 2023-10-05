import { useEffect, useRef, useState } from "react"

export default function useFetch<T>(
  url: RequestInfo | URL,
  options?: RequestInit
): {
  data?: T,
  setData: (data: T | undefined) => void,
  error: boolean,
  isLoading: boolean
} {
  const [data, setData] = useState<T>()
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(url, options)
        if (!resp.ok) {
          throw new Error(`${resp}\n${resp.statusText}`)
        }

        setData(await resp.json() as T)
      } catch (e) {
        console.error(e)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url, options])

  return { data, setData, error, isLoading }
}
import useFetch from "./useFetch"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export default function useBackendFetch<T>(
  pathh: string,
  options?: RequestInit
): {
  data?: T,
  setData: (data: T | undefined) => void,
  error: boolean,
  isLoading: boolean
} {
  if (!BACKEND_URL)
    throw new Error("Please, provide NEXT_PUBLIC_BACKEND_URL")

  const url = BACKEND_URL + pathh

  return useFetch(url, options)
}
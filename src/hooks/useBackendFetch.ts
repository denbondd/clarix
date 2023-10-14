import useFetch from "./useFetch"

export default function useBackendFetch<T>(
  pathh: string,
  options?: RequestInit
): {
  data?: T,
  setData: (data: T | undefined) => void,
  error: boolean,
  isLoading: boolean
} {
  const url = '/api' + pathh

  return useFetch(url, options)
}
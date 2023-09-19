import path from "path"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export function backendFetch(
  backendPath: string,
  options?: RequestInit
): Promise<Response> {
  if (!BACKEND_URL)
    throw new Error("Please, provide NEXT_PUBLIC_BACKEND_URL")

  const url = path.join(BACKEND_URL, backendPath)

  return fetch(url, options)
    .then(resp => {
      if (resp.ok) {
        return resp
      } else {
        throw new Error(`${resp}\n${resp.statusText}`)
      }
    })
}
export function backendFetch(
  backendPath: string,
  options?: RequestInit
): Promise<Response> {
  const url = '/api' + backendPath //TODO try as before

  return fetch(url, options)
    .then(resp => {
      if (resp.ok) {
        return resp
      } else {
        throw new Error(`${resp.url}\n${resp.statusText}\n${resp.status}\n${resp.type}`)
      }
    })
}
export function backendFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  return fetch(path, options)
    .then(resp => {
      if (resp.ok) {
        return resp
      } else {
        throw new Error(
          `${resp.url}\n${resp.statusText}\n${resp.status}\n${resp.type}`
        )
      }
    })
    .catch(err => {
      console.error({ path, options, err })
      throw err
    })
}

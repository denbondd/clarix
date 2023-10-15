import useSWR from "swr"
import { fetcher } from "./common"

export const useFileContent = (fileId: string | number) => {
  const {
    data: fileContent,
    isLoading,
    error,
  } = useSWR<{ content: string }>(`/api/kb/files/${fileId}/content`, fetcher)

  return {
    fileContent,
    isLoading,
    error,
  }
}

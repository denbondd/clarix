import { ModelEntity } from "@/lib/entities"
import { fetcher } from "./common"
import useSWR from "swr"

export const useModels = () => {
  const {
    data: models,
    isLoading,
    error,
  } = useSWR<ModelEntity[]>("/api/models", fetcher)

  return {
    models,
    isLoading,
    error,
  }
}
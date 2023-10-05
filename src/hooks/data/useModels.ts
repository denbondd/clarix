import { ModelEntity } from "@/lib/entities";
import { create } from "zustand";
import { fetchStateData } from "./common";

interface ModelsState {
  models: ModelEntity[] | undefined,
  modelsError: boolean
}

export const useModels = create<ModelsState>(() => ({
  models: undefined,
  modelsError: false
}))

fetchStateData(
  '/models',
  data => useModels.setState({ models: data }),
  error => useModels.setState({ modelsError: error })
)()
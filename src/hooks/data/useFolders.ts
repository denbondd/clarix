import { FolderEntity } from "@/lib/entities";
import { create } from "zustand";
import { fetchStateData } from "./common";

interface FoldersState {
  folders: FolderEntity[] | undefined,
  foldersError: boolean,
  // createFile: (folderId: number, file: FileEntity) => Promise<void>
}

export const useFolders = create<FoldersState>(() => ({
  folders: undefined,
  foldersError: false,
  // createFile: (folderId, file) => {

  // },
}))

fetchStateData(
  '/kb/folders',
  data => useFolders.setState({ folders: data }),
  error => useFolders.setState({ foldersError: error })
)()
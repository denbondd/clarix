import { FileEntity, FolderEntity } from "@/lib/entities";
import { create } from "zustand";
import { fetchStateData } from "./common";
import { backendFetch } from "@/utils/backendFetch";

interface FoldersState {
  folders: FolderEntity[] | undefined,
  foldersError: boolean,
  createFolder: (folderName: string) => Promise<number>,
  deleteFolder: (folderId: number) => Promise<void>,
  renameFolder: (folderId: number, newName: string) => Promise<void>
  createFile: (data: {
    content: string,
    fileName: string,
    folderId: number
  }, onCreatedNotLearned: () => void) => Promise<void>,
  updateFile: (data: {
    prevFile: FileEntity | undefined,
    prevContent: string,
    content: string,
    fileName: string,
  }, onCreatedNotLearned: () => void) => Promise<void>,
  deleteFile: (fileId: number) => Promise<void>
}

export const useFolders = create<FoldersState>((set, get) => ({
  folders: undefined,
  foldersError: false,
  createFolder: (folderName) => {
    return backendFetch('/kb/folders', {
      method: 'POST',
      body: JSON.stringify({ name: folderName })
    })
      .then(resp => resp.json())
      .then(json => {
        const newFold = json as FolderEntity
        newFold.files = []
        set({ folders: get().folders?.concat(newFold) })
        return newFold.folder_id
      })
  },
  deleteFolder: (folderId) => {
    return backendFetch('/kb/folders/' + folderId, {
      method: 'DELETE',
    })
      .then(_ => set({ folders: get().folders?.filter(fold => fold.folder_id !== folderId) }))
  },
  renameFolder: (folderId, newName) => {
    return backendFetch('/kb/folders/' + folderId, {
      method: 'PUT',
      body: JSON.stringify({
        name: newName
      })
    })
      .then(_ => {
        const newFold = get().folders?.find(fold => fold.folder_id === folderId) as FolderEntity
        newFold.name = newName
        set({ folders: get().folders?.map(fold => fold.folder_id !== folderId ? fold : newFold) })
      })
  },
  createFile: (data, onCreatedNotLearned) => {
    return backendFetch('/kb/files', {
      method: 'POST',
      body: JSON.stringify({
        name: data.fileName,
        content: data.content,
        folderId: data.folderId
      })
    })
      .then(res => res.json())
      .then(json => {
        const newFile = json as FileEntity
        onCreatedNotLearned()
        set({ folders: appendFileToFolder(get().folders, newFile) })
        return backendFetch('/kb/files/' + newFile.file_id + '/embeddings', { method: 'PUT' })
          .then(_ => {
            newFile._count.embeddings = 1
            set({ folders: replaceFileInFolder(get().folders, newFile) })
          })
      })
  },
  updateFile: (data, onCreatedNotLearned) => {
    if (data.prevFile?.name !== data.fileName || data.prevContent !== data.content) {
      return backendFetch('/kb/files/' + data.prevFile?.file_id, {
        method: 'PUT',
        body: JSON.stringify({
          name: data.fileName === data.prevFile?.name ? undefined : data.fileName,
          content: data.prevContent === data?.content ? undefined : data.content
        })
      }).then(_ => {
        if (data.content !== data.prevContent) {
          onCreatedNotLearned()
          return backendFetch('/kb/files/' + data.prevFile?.file_id + '/embeddings', {
            method: 'PUT'
          }) as unknown as Promise<void>
        } else {
          return Promise.resolve()
        }
      })
        .then(_ => {
          const newFile = data.prevFile as FileEntity
          newFile.name = data.fileName
          set({ folders: replaceFileInFolder(get().folders, newFile) })
        })
    }
    else {
      return Promise.resolve()
    }
  },
  deleteFile: (fileId) => {
    return backendFetch('/kb/files/' + fileId, {
      method: 'DELETE'
    })
      .then(_ => {
        set({ folders: deleteFileInFolder(get().folders, fileId) })
      })
  }
}))

fetchStateData(
  '/kb/folders',
  data => useFolders.setState({ folders: data }),
  error => useFolders.setState({ foldersError: error })
)()

export const fetchFileContent = (fileId: string | number, options?: any): Promise<{ content: string }> => {
  return backendFetch(`/kb/files/ ${fileId}/content`, options)
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      throw err
    })
}

export const findFolderById = (folders: FolderEntity[] | undefined, folderId: number | undefined) =>
  folders?.find(fold => fold.folder_id === folderId)

export const findFileById = (folders: FolderEntity[] | undefined, fileId: number) =>
  folders?.map(fold => fold.files)
    .flat()
    .find(file => file.file_id === fileId)

const replaceFileInFolder = (folders: FolderEntity[] | undefined, file: FileEntity) => {
  return folders?.map(fold => fold.folder_id !== file.folder_id ? fold : {
    name: fold.name,
    created_at: fold.created_at,
    folder_id: fold.folder_id,
    user_id: fold.user_id,
    files: fold.files.map(file => file.file_id !== file.file_id ? file : file)
  })
}
const appendFileToFolder = (folders: FolderEntity[] | undefined, file: FileEntity) => {
  return folders?.map(fold => fold.folder_id !== file.folder_id ? fold : {
    name: fold.name,
    created_at: fold.created_at,
    folder_id: fold.folder_id,
    user_id: fold.user_id,
    files: fold.files.concat(file)
  })
}
const deleteFileInFolder = (folders: FolderEntity[] | undefined, fileId: number) => {
  return folders?.map(fold => {
    const newFold = fold
    newFold.files = newFold.files.filter(file => file.file_id !== fileId)
    return newFold
  })
}
import useSWR from "swr"
import { fetcher } from "./common"
import { backendFetch } from "@/utils/backendFetch"
import { FileEntity, FolderEntity } from "@/lib/entities"

export const useFolders = () => {
  const {
    data: folders,
    isLoading,
    error,
    mutate,
  } = useSWR<FolderEntity[]>("/api/kb/folders", fetcher)

  const createFolder = async (folderName: string) => {
    return backendFetch("/api/kb/folders", {
      method: "POST",
      body: JSON.stringify({ name: folderName }),
    })
      .then(resp => resp.json())
      .then(json => {
        const newFold = json as FolderEntity
        newFold.files = []
        mutate(folders?.concat(newFold))
        return newFold.folder_id
      })
  }

  const deleteFolder = async (folderId: number) => {
    return backendFetch("/api/kb/folders/" + folderId, {
      method: "DELETE",
    }).then(_ => mutate(folders?.filter(fold => fold.folder_id !== folderId)))
  }

  const renameFolder = async (folderId: number, newName: string) => {
    return backendFetch("/api/kb/folders/" + folderId, {
      method: "PUT",
      body: JSON.stringify({
        name: newName,
      }),
    }).then(_ => {
      const newFold = folders?.find(
        fold => fold.folder_id === folderId
      ) as FolderEntity
      newFold.name = newName
      mutate(
        folders?.map(fold => (fold.folder_id !== folderId ? fold : newFold))
      )
    })
  }

  const changeFolder = async (fileId: number, newFolderId: number) => {
    return backendFetch("/api/kb/files/" + fileId, {
      method: "PUT",
      body: JSON.stringify({
        folderId: newFolderId,
      }),
    })
      .then(res => res.json())
      .then(json => {
        mutate(deleteFileInFoldersArray(folders, fileId))
        mutate(appendFileToFoldersArray(folders, json))
      })
  }

  const createFile = async (
    data: {
      content: string
      fileName: string
      folderId: number
    },
    onCreatedNotLearned: () => void
  ) => {
    return backendFetch("/api/kb/files", {
      method: "POST",
      body: JSON.stringify({
        name: data.fileName,
        content: data.content,
        folderId: data.folderId,
      }),
    })
      .then(res => res.json())
      .then(json => {
        onCreatedNotLearned()
        mutate(appendFileToFoldersArray(folders, json))
        return backendFetch("/api/kb/files/" + json.file_id + "/embeddings", {
          method: "PUT",
        })
          .then(res => res.json())
          .then(json => {
            mutate(replaceFileInFoldersArray(folders, json))
          })
      })
  }

  const updateFile = async (
    data: {
      prevFile: FileEntity | undefined
      prevContent: string
      content: string
      fileName: string
    },
    onCreatedNotLearned: () => void
  ) => {
    if (
      data.prevFile?.name !== data.fileName ||
      data.prevContent !== data.content
    ) {
      return backendFetch("/kb/files/" + data.prevFile?.file_id, {
        method: "PUT",
        body: JSON.stringify({
          name:
            data.fileName === data.prevFile?.name ? undefined : data.fileName,
          content:
            data.prevContent === data?.content ? undefined : data.content,
        }),
      })
        .then(_ => {
          if (data.content !== data.prevContent) {
            onCreatedNotLearned()
            return backendFetch(
              "/kb/files/" + data.prevFile?.file_id + "/embeddings",
              {
                method: "PUT",
              }
            ) as unknown as Promise<void>
          } else {
            return Promise.resolve()
          }
        })
        .then(_ => {
          const newFile = data.prevFile as FileEntity
          newFile.name = data.fileName
          mutate(replaceFileInFoldersArray(folders, newFile))
        })
    } else {
      return Promise.resolve()
    }
  }

  const deleteFile = async (fileId: number) => {
    return backendFetch("/api/kb/files/" + fileId, {
      method: "DELETE",
    }).then(_ => {
      mutate(deleteFileInFoldersArray(folders, fileId))
    })
  }

  return {
    folders,
    isLoading,
    error,
    createFolder,
    deleteFolder,
    renameFolder,
    changeFolder,
    createFile,
    updateFile,
    deleteFile,
  }
}

const deleteFileInFoldersArray = (
  folders: FolderEntity[] | undefined,
  fileId: number
) => {
  return folders?.map(fold => {
    const newFold = fold
    newFold.files = newFold.files.filter(file => file.file_id !== fileId)
    return newFold
  })
}
const appendFileToFoldersArray = (
  folders: FolderEntity[] | undefined,
  file: FileEntity
) => {
  return folders?.map(fold =>
    fold.folder_id !== file.folder_id
      ? fold
      : {
          name: fold.name,
          created_at: fold.created_at,
          folder_id: fold.folder_id,
          user_id: fold.user_id,
          files: fold.files.concat(file),
        }
  )
}
const replaceFileInFoldersArray = (
  folders: FolderEntity[] | undefined,
  file: FileEntity
) => {
  return folders?.map(fold =>
    fold.folder_id !== file.folder_id
      ? fold
      : {
          name: fold.name,
          created_at: fold.created_at,
          folder_id: fold.folder_id,
          user_id: fold.user_id,
          files: fold.files.map(file =>
            file.file_id !== file.file_id ? file : file
          ),
        }
  )
}

export const fetchFileContent = (
  fileId: string | number,
  options?: any
): Promise<{ content: string }> => {
  return backendFetch(
    `${process.env.NEXTAUTH_URL}/api/kb/files/${fileId}/content`,
    options
  )
    .then(res => res.json())
    .catch(err => {
      console.error(err)
      throw err
    })
}

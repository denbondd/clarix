'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import FolderHeader from "./folder-header"
import CreateDocuementsSection from "./create-documents-section"
import FileRow from "./file-row"
import { FileEntity, FolderEntity } from "@/lib/entities"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Combobox } from "@/components/ui/combobox"
import { useFolders } from "@/hooks/data/useFolders"
import WithLoading from "@/components/with-loading"

export default function FolderElem({ params }: { params: { folderId: string } }) {
  const allFolders = useFolders((state) => state.folders)
  const folder = useFolders((state) => state.folders)
    ?.find(v => v.folder_id.toString() === params.folderId)
  const foldersError = useFolders((state) => state.foldersError)

  const [openAnyMenu, setOpenAnyMenu] = useState(false)

  const [changeFolderFile, setChangeFolderFile] = useState<FileEntity>()
  const [enteredFId, setEnteredFId] = useState('')

  const handleOnFileCreate = (file: FileEntity) => {
    // const newFolder: FolderEntity | undefined = folder ? {
    //   name: folder.name,
    //   created_at: folder.created_at,
    //   folder_id: folder.folder_id,
    //   user_id: folder.user_id,
    //   files: folder.files.concat(file)
    // } : undefined
    // setFolder(newFolder)//TODO
  }

  const handleChangeFolder = () => {
    if (!enteredFId) {
      toast({
        title: 'Input folder name'
      })
    }
    if (enteredFId === folder?.folder_id.toString()) {
      toast({
        title: 'File is already in this folder'
      })
    }

  }

  return <WithLoading data={allFolders} error={foldersError}>
    <ScrollArea className="max-h-[calc(100vh-60px)] w-full flex-1">
      {folder &&
        <div className="m-2 flex flex-col gap-4">
          <FolderHeader folder={folder} openAnyMenu={openAnyMenu} setOpenAnyMenu={setOpenAnyMenu} />
          <hr />
          <CreateDocuementsSection onCreate={handleOnFileCreate} folder={folder} />

          <div>
            <h4 className="text-xl font-semibold tracking-tight mb-2">Stored Documents</h4>
            <Dialog>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Edited On</TableHead>
                    <TableHead>Created On</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                {(!folder.files || folder.files.length === 0) && (
                  <TableCaption>
                    NO FILES
                  </TableCaption>
                )}
                <TableBody>
                  {folder.files.map((f, idx) => (
                    <FileRow file={f} onChangeFolderClick={() => setChangeFolderFile(f)} key={idx} />
                  ))}
                </TableBody>
              </Table>

              <DialogContent className="w-max">
                <DialogTitle>
                  Change folder for {changeFolderFile?.name}
                </DialogTitle>
                <DialogDescription>
                  Choose new folder:
                </DialogDescription>
                <Combobox
                  btnTriggerText="Select folder..."
                  noFoundText="No folder found"
                  placeholder="Search folder..."
                  elements={allFolders?.map(f => {
                    return {
                      label: f.name,
                      value: f.folder_id.toString()
                    }
                  }) ?? []}
                  value={enteredFId}
                  onValueChange={setEnteredFId}
                />
                <DialogFooter>
                  <DialogTrigger asChild>
                    <Button
                      variant='secondary'
                      onClick={() => setEnteredFId('')}
                    >
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <Button onClick={handleChangeFolder} variant='default'>
                    Change Folder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      }
    </ScrollArea >
  </WithLoading>
}
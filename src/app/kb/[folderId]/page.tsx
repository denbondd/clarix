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
import useBackendFetch from "@/hooks/useBackendFetch"
import { useState } from "react"
import FolderHeader from "./folder-header"
import CreateDocuementsSection from "./create-documents-section"
import FileRow from "./file-row"
import { FileEntity, FolderEntity } from "@/lib/entities"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

export default function FolderElem({ params }: { params: { folderId: string } }) {
  const { data: folder, setData: setFolder, error, isLoading } = useBackendFetch<FolderEntity>('/kb/folders/' + params.folderId)
  const [openAnyMenu, setOpenAnyMenu] = useState(false)

  const [changeFolderFile, setChangeFolderFile] = useState<FileEntity>()
  const [openChangeFolder, setOpenChangeFolder] = useState(false)
  const [enteredFName, setEnteredFName] = useState('')

  const { data: allFolders } = useBackendFetch<FolderEntity[]>('/kb/folders')

  const handleOnFileCreate = (file: FileEntity) => {
    const newFolder: FolderEntity | undefined = folder ? {
      name: folder.name,
      created_at: folder.created_at,
      folder_id: folder.folder_id,
      user_id: folder.user_id,
      files: folder.files.concat(file)
    } : undefined
    setFolder(newFolder)
  }

  const handleChangeFolder = () => { //todo move change folder part to another tsx file
    if (!enteredFName) {
      toast({
        title: 'Input folder name'
      })
    }
    if (enteredFName === folder?.name) {
      toast({
        title: 'File is already in this folder'
      })
    }

  }

  if (isLoading) return 'Loading...'
  else if (error) return 'Error'
  else if (folder) return (
    <ScrollArea className="max-h-[calc(100vh-60px)] w-full flex-1">
      <div className="m-2 flex flex-col gap-4">
        <FolderHeader folder={folder} openAnyMenu={openAnyMenu} setOpenAnyMenu={setOpenAnyMenu} />
        <hr />
        <CreateDocuementsSection onCreate={handleOnFileCreate} folderId={params.folderId} />

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
              <Popover open={openChangeFolder} onOpenChange={setOpenChangeFolder}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openChangeFolder}
                    className="justify-between w-[200px]"
                  >
                    {enteredFName
                      ? allFolders?.find((fold) => fold.name === enteredFName)?.name
                      : "Select folder..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search folder..." />
                    <CommandEmpty>No folders found.</CommandEmpty>
                    <CommandGroup>
                      {allFolders?.map((fold) => (
                        <CommandItem
                          key={fold.folder_id}
                          onSelect={(currentValue) => {
                            setEnteredFName(currentValue === enteredFName ? "" : currentValue)
                            setOpenChangeFolder(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              enteredFName === fold.name ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {fold.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button
                    variant='secondary'
                    onClick={() => setEnteredFName('')}
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

    </ScrollArea >
  )
}
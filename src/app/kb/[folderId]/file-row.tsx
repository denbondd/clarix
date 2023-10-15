"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { FileEntity } from "@/lib/entities"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { generalErrorToast, toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ConfirmDialog from "@/components/confirm-dialog"
import { useFolders } from "@/hooks/data/useFolders"
import { parseDateStr } from "@/lib/utils"
import { useState } from "react"
import { Combobox } from "@/components/ui/combobox"
import { LoadingButton } from "@/components/loading-button"

export default function FileRow(props: { file: FileEntity }) {
  const router = useRouter()

  const [openDelete, setOpenDelete] = useState(false)
  const [openChangeFolder, setOpenChangeFolder] = useState(false)
  const [isChangeFolderLoading, setIsChangeFolderLoading] = useState(false)
  const [enteredFId, setEnteredFId] = useState("")

  const {folders, deleteFile, changeFolder} = useFolders()

  const handleDeleteFile = (): Promise<void> => {
    return deleteFile(props.file.file_id)
      .then(() => setOpenDelete(false))
      .catch(_ => {
        generalErrorToast()
      })
  }

  const handleChangeFolder = () => {
    if (!enteredFId) {
      toast({
        title: "Input folder name",
      })
      return
    }
    if (enteredFId === props.file.folder_id.toString()) {
      toast({
        title: "File is already in this folder",
      })
      return
    }
    setIsChangeFolderLoading(true)
    changeFolder(props.file.file_id, Number.parseInt(enteredFId))
      .then(() => {
        setIsChangeFolderLoading(false)
        setOpenChangeFolder(false)
      })
      .catch(() => {
        generalErrorToast()
      })
  }

  const getStatusBadge = (embeddingsCount: number) => {
    return (
      <Badge variant={embeddingsCount > 0 ? "success" : "default"}>
        {embeddingsCount > 0 ? "Learned" : "New"}
      </Badge>
    )
  }
  return (
    <>
      <TableRow>
        <TableCell>{props.file.name}</TableCell>
        <TableCell>{getStatusBadge(props.file._count.embeddings)}</TableCell>
        <TableCell>
          {parseDateStr(props.file.edited_at, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </TableCell>
        <TableCell>
          {parseDateStr(props.file.created_at, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </TableCell>
        <TableCell className="flex gap-0">
          <Button
            variant="outline"
            className="rounded-r-none border-r-0"
            asChild
          >
            <Link href={`/kb/${props.file.folder_id}/${props.file.file_id}`}>
              View
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="p-0 h-10 w-10 rounded-l-none"
                asChild
              >
                <div>
                  <MoreVertical size={18} />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/kb/${props.file.folder_id}/${props.file.file_id}/edit`
                  )
                }
              >
                Edit
              </DropdownMenuItem>
              {/* <DialogTrigger asChild> */}
              <DropdownMenuItem onClick={() => setOpenChangeFolder(true)}>
                Change folder
              </DropdownMenuItem>
              {/* </DialogTrigger> */}

              <DropdownMenuSeparator />
              <ConfirmDialog
                title="Delete file"
                description={
                  "Are you sure you want to delete file " +
                  props.file.name +
                  "? You will lost it and will not be able to recover it " +
                  "unless you have a local copy."
                }
                onSubmit={handleDeleteFile}
                isDestructive
                confirmBtnText="Delete"
                asChild
                dialogProps={{ open: openDelete, onOpenChange: setOpenDelete }}
              >
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={e => e.preventDefault()}
                >
                  Delete
                </DropdownMenuItem>
              </ConfirmDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <Dialog open={openChangeFolder} onOpenChange={setOpenChangeFolder}>
        <DialogContent className="w-max">
          <DialogTitle>Change folder for {props.file.name}</DialogTitle>
          <DialogDescription>Choose new folder:</DialogDescription>
          <Combobox
            btnTriggerText="Select folder..."
            noFoundText="No folder found"
            placeholder="Search folder..."
            elements={
              folders?.map(f => {
                return {
                  label: f.name,
                  value: f.folder_id.toString(),
                }
              }) ?? []
            }
            value={enteredFId}
            onValueChange={setEnteredFId}
          />
          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogTrigger>
            <LoadingButton
              isLoading={isChangeFolderLoading}
              onClick={handleChangeFolder}
              variant="default"
            >
              Change Folder
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

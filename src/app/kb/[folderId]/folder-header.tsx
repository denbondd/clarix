"use client"

import ConfirmDialog from "@/components/confirm-dialog"
import { LoadingButton } from "@/components/loading-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { generalErrorToast } from "@/components/ui/use-toast"
import { useFolders } from "@/hooks/data/useFolders"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

interface FolderHeaderProps {
  folder: { name: string; folder_id: number }
  openAnyMenu: boolean
  setOpenAnyMenu: (b: boolean) => void
}

export default function FolderHeader(props: FolderHeaderProps) {
  const { deleteFolder, renameFolder } = useFolders()

  const [isRenameBtnLoading, setIsRenameBtnLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const router = useRouter()

  const handleFolderDelete = (): Promise<void> => {
    return deleteFolder(props.folder.folder_id)
      .then(_ => {
        router.push("/kb")
      })
      .catch(_ => {
        generalErrorToast()
      })
  }

  const handleFolderRename = (values: z.infer<typeof folderRenameSchema>) => {
    setIsRenameBtnLoading(true)
    renameFolder(props.folder.folder_id, values.folderName)
      .then(_ => setOpenDialog(false))
      .catch(_ => generalErrorToast())
      .finally(() => setIsRenameBtnLoading(false))
  }

  const folderRenameSchema = z.object({
    folderName: z
      .string({ required_error: "Folder name is required" })
      .min(3, { message: "Folder name must me at least 3 characters" })
      .max(60, { message: "Too long for a folder name, try something shorter" })
      .refine(name => props.folder.name != name, {
        message: "This folder is already named this",
      }),
  })

  const form = useForm<z.infer<typeof folderRenameSchema>>({
    resolver: zodResolver(folderRenameSchema),
    defaultValues: {
      folderName: props.folder.name ?? "",
    },
  })

  const handleOpenChange = (open: boolean) => {
    form.reset()
    setOpenDialog(open)
  }

  const deleteDialogDescription =
    "Are you sure you want to delete folder " +
    props.folder.name +
    "? You will lost all your files and could not recover them " +
    "unless you have a local copy. \nAll agents will forget about " +
    "this folder, however, you won't loose your chats"
  return (
    <DropdownMenu open={props.openAnyMenu} onOpenChange={props.setOpenAnyMenu}>
      <DropdownMenuTrigger className="w-max">
        <Button
          asChild
          variant="secondary"
          className="w-max text-2xl font-semibold"
        >
          <div>{props.folder.name}</div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog open={openDialog} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              Rename
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename folder</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFolderRename)}>
                <FormField
                  control={form.control}
                  name="folderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Folder name</FormLabel>
                      <FormControl>
                        <Input placeholder="Folder name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-4">
                  <DialogTrigger asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogTrigger>
                  <LoadingButton isLoading={isRenameBtnLoading} type="submit">
                    Rename
                  </LoadingButton>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <DropdownMenuSeparator />
        <ConfirmDialog
          confirmBtnText="Delete folder"
          onSubmit={handleFolderDelete}
          isDestructive
          title="Delete folder"
          description={deleteDialogDescription}
          asChild
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
  )
}

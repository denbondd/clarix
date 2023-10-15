"use client"

import { useEffect, useState } from "react"

import { generalErrorToast } from "@/components/ui/use-toast"
import Sidebar from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FolderPlus } from "lucide-react"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoadingButton } from "@/components/loading-button"
import { useFolders } from "@/hooks/data/useFolders"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import WithLoading from "@/components/with-loading"
import { useSearch } from "@/hooks/useSearch"

export default function KbLayout(props: { children: React.ReactNode }) {
  const { folders, isLoading, error, createFolder } = useFolders()
  const {
    filteredData: filteredFolders,
    searchInput,
    handleSearchInputChange,
  } = useSearch(folders)

  const path = usePathname()
  const [currentFolderId, setCurrentFolderId] = useState(-1)
  useEffect(() => {
    const pathParts = path.split("/")
    setCurrentFolderId(
      pathParts.length == 2 ? -1 : Number.parseInt(pathParts[2])
    )
  }, [path])

  const [isAddBtnLoading, setIsAddBtnLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const router = useRouter()

  const onSubmit = (values: z.infer<typeof createFolderSchema>) => {
    setIsAddBtnLoading(true)
    createFolder(values.folderName)
      .then(foldId => {
        setOpenDialog(false)
        router.push("/kb/" + foldId)
      })
      .catch(_ => generalErrorToast())
      .finally(() => setIsAddBtnLoading(false))
  }

  const createFolderSchema = z.object({
    folderName: z
      .string({ required_error: "Folder name is required" })
      .min(3, { message: "Folder name must me at least 3 characters" })
      .max(60, { message: "Too long for a folder name, try something shorter" })
      .refine(name => !filteredFolders?.find(f => f.name == name), {
        message: "Folder with this name already exists",
      }),
  })

  const form = useForm<z.infer<typeof createFolderSchema>>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      folderName: "",
    },
  })

  const handleOpenChange = (open: boolean) => {
    setOpenDialog(open)
    form.reset()
  }

  return (
    <div className="flex w-full h-full">
      <Sidebar>
        <div className="flex w-full gap-1 items-center mb-4">
          <Input
            placeholder="Search folder"
            value={searchInput}
            onChange={handleSearchInputChange}
          />

          <Dialog open={openDialog} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button size="icon" className="flex-none">
                <FolderPlus size={22} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Folder</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    <LoadingButton isLoading={isAddBtnLoading} type="submit">
                      Create
                    </LoadingButton>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className=" flex flex-col gap-2">
          <WithLoading data={folders} isLoading={isLoading} error={error}>
            {filteredFolders &&
              filteredFolders.length === 0 &&
              !searchInput &&
              "You have no folders yet(("}
            {filteredFolders && filteredFolders.length > 0 && (
              <div className="flex flex-col gap-2">
                {filteredFolders
                  .sort(
                    (a, b) =>
                      Date.parse(a.created_at) - Date.parse(b.created_at)
                  )
                  .map((f, idx) => (
                    <Button
                      key={idx}
                      asChild
                      variant={
                        f.folder_id === currentFolderId
                          ? "secondary"
                          : "outline"
                      }
                      className="w-full justify-start border"
                    >
                      <Link
                        href={"/kb/" + f.folder_id}
                        className="flex justify-between"
                      >
                        <div>{f.name}</div>
                        <div>{f.files.length}</div>
                      </Link>
                    </Button>
                  ))}
              </div>
            )}
          </WithLoading>
        </div>
      </Sidebar>
      <div className="max-w-6xl w-full mx-auto">{props.children}</div>
    </div>
  )
}

"use client"

import ConfirmDialog from "@/components/confirm-dialog"
import { LoadingButton } from "@/components/loading-button"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { generalErrorToast, toast } from "@/components/ui/use-toast"
import WithLoading from "@/components/with-loading"
import { useFileContent } from "@/hooks/data/useFileContent"
import { useFolders } from "@/hooks/data/useFolders"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

export default function EditFile({
  params,
}: {
  params: { folderId: string; fileId: string }
}) {
  const fileId = Number.parseInt(params.fileId)
  const folderId = Number.parseInt(params.folderId)

  const { fileContent, isLoading, error } = useFileContent(fileId)
  const { folders, updateFile, deleteFile } = useFolders()
  const folder = folders?.find(f => f.folder_id === folderId)
  const file = folder?.files.find(f => f.file_id === fileId)

  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    form.setValue("fileName", file?.name ?? "")
  }, [folders])
  useEffect(() => {
    form.setValue("content", fileContent?.content ?? "")
  }, [fileContent])

  const handleDeleteFile = (): Promise<void> => {
    return deleteFile(fileId)
      .then(_ => router.replace("/kb/" + folderId))
      .catch(_ => {
        generalErrorToast()
      })
  }

  const handleSaveLearnFile = async (values: z.infer<typeof editDocSchema>) => {
    setIsSaveLoading(true)
    await updateFile(
      {
        prevFile: file,
        prevContent: fileContent?.content ?? "",
        content: values.content,
        fileName: values.fileName,
      },
      () =>
        toast({
          title: "File was created!",
          description: "Now give us some time to learn it",
        })
    )
      .catch(_ => generalErrorToast())
      .finally(() => setIsSaveLoading(false))

    router.push(`/kb/${folderId}/${fileId}`)
  }

  const editDocSchema = z.object({
    fileName: z
      .string({ required_error: "File name is required" })
      .min(3, { message: "File name must me at least 3 characters" })
      .max(60, { message: "Too long for a file name, try something shorter" })
      .refine(
        str => str === file?.name || !folder?.files.find(f => f.name === str),
        "File with this name already exists in this folder"
      ),
    content: z.string({ required_error: "File content is required" }),
  })

  const form = useForm<z.infer<typeof editDocSchema>>({
    resolver: zodResolver(editDocSchema),
  })

  return (
    <div className="m-2">
      <div className="flex gap-2 flex-col items-center">
        <div className="flex w-full justify-between">
          <div className="flex gap-2 items-center">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => router.back()}
            >
              <ChevronLeft />
            </Button>
            <div className="text-lg font-semibold">{file?.name}</div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" asChild>
              <Link href={"/kb/file/" + fileId}>Cancel</Link>
            </Button>
            <ConfirmDialog
              title="Delete file"
              description={
                "Are you sure you want to delete file " +
                file?.name +
                "? You will lost it and will not be able to recover it " +
                "unless you have a local copy."
              }
              onSubmit={handleDeleteFile}
              isDestructive
              confirmBtnText="Delete"
              asChild
            >
              <Button variant="destructive">Delete</Button>
            </ConfirmDialog>

            <LoadingButton
              type="submit"
              form="editForm"
              isLoading={isSaveLoading}
            >
              Save and Learn
            </LoadingButton>
          </div>
        </div>
        <hr />{" "}
        <WithLoading data={fileContent} isLoading={isLoading} error={error}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSaveLearnFile)}
              id="editForm"
            >
              <FormField
                control={form.control}
                name="fileName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File name</FormLabel>
                    <FormControl>
                      <Input placeholder="File name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File content</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-[calc(100vh-250px)]"
                        placeholder="File content"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </WithLoading>
      </div>
    </div>
  )
}

'use client'

import ConfirmDialog from "@/components/confirm-dialog";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generalErrorToast, toast } from "@/components/ui/use-toast";
import WithLoading from "@/components/with-loading";
import { fetchFileContent, findFileById, findFolderById, useFolders } from "@/hooks/data/useFolders";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'

export default function EditFile({ params }: { params: { folderId: string, fileId: string } }) {
  const fileId = Number.parseInt(params.fileId)
  const folderId = Number.parseInt(params.folderId)

  const file = useFolders((state) => findFileById(state.folders, fileId))
  const folder = useFolders((state) => findFolderById(state.folders, folderId))
  const updateFile = useFolders((state) => state.updateFile)
  const deleteFile = useFolders((state) => state.deleteFile)

  let origContent = ''
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const [fileContentStatus, setFileContentStatus] = useState({ isLoading: true, error: false })
  const router = useRouter()

  useEffect(() => {
    fetchFileContent(fileId)
      .then(answ => {
        form.setValue("content", answ.content)
        origContent = answ.content
      })
      .catch(err => setFileContentStatus({ isLoading: false, error: true }))
      .finally(() => setFileContentStatus({ isLoading: false, error: fileContentStatus.error }))
  }, [fileId])


  const handleDeleteFile = (): Promise<void> => {
    return deleteFile(file?.file_id ?? -1)
      .then(_ => router.replace('/kb/' + folderId))
      .catch(_ => { generalErrorToast() })
  }

  const handleSaveLearnFile = async (values: z.infer<typeof editDocSchema>) => {
    setIsSaveLoading(true)
    await updateFile({
      prevFile: file,
      prevContent: origContent,
      content: values.content,
      fileName: values.fileName,
    }, () => toast({
      title: 'File was created!',
      description: 'Now give us some time to learn it'
    }))
      .catch(_ => generalErrorToast())
      .finally(() => setIsSaveLoading(false))

    router.push('/kb/files/' + file?.file_id)
  }

  const editDocSchema = z.object({
    fileName: z.string({ required_error: 'File name is required' })
      .min(3, { message: 'File name must me at least 3 characters' })
      .max(60, { message: 'Too long for a file name, try something shorter' })
      .refine(
        str => str === file?.name || !folder?.files.find(f => f.name === str),
        'File with this name already exists in this folder'
      )
    ,
    content: z.string({ required_error: 'File content is required' })
  })

  const form = useForm<z.infer<typeof editDocSchema>>({
    resolver: zodResolver(editDocSchema),
  })

  useEffect(() => {
    form.setValue('fileName', file?.name ?? '')
  }, [file])

  return (
    <div className="m-2">
      <WithLoading data={true} isLoading={fileContentStatus.isLoading} error={fileContentStatus.error}>
        {file && (
          <div className="flex gap-2 flex-col items-center">
            <div className="flex w-full justify-between">
              <div className="flex gap-2 items-center">
                <Button
                  variant='secondary'
                  size='icon'
                  onClick={() => router.back()}
                >
                  <ChevronLeft />
                </Button>
                <div className="text-lg font-semibold">
                  {file?.name}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant='secondary' asChild>
                  <Link href={'/kb/file/' + file.file_id}>
                    Cancel
                  </Link>
                </Button>
                <ConfirmDialog
                  title="Delete file"
                  description={"Are you sure you want to delete file " + file?.name +
                    '? You will lost it and will not be able to recover it ' +
                    'unless you have a local copy.'}
                  onSubmit={handleDeleteFile}
                  isDestructive
                  confirmBtnText="Delete"
                  asChild
                >
                  <Button variant='destructive'>
                    Delete
                  </Button>
                </ConfirmDialog>

                <LoadingButton type="submit" form="editForm" isLoading={isSaveLoading}>
                  Save and Learn
                </LoadingButton>
              </div>
            </div>
            <hr />
            <Form {...form}>
              <form className="w-full" onSubmit={form.handleSubmit(handleSaveLearnFile)} id="editForm">
                <FormField
                  control={form.control}
                  name="fileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        File name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='File name' {...field} />
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
                      <FormLabel>
                        File content
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder='File content' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        )}
      </WithLoading>
    </div>
  )
}
'use client'

import ConfirmDialog from "@/components/confirm-dialog";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generalErrorToast, toast } from "@/components/ui/use-toast";

import useBackendFetch from "@/hooks/useBackendFetch";
import { FileEntity, FolderEntity } from "@/lib/entities";
import { backendFetch } from "@/utils/backendFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'

export default function EditFile({ params }: { params: { fileId: string } }) {
  const { data: file, error, isLoading } = useBackendFetch<FileEntity>('/kb/files/' + params.fileId)
  //TODO const { data: folder } = useBackendFetch<FolderEntity>('/kb/folders/' + file?.folder_id)

  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const router = useRouter()

  const handleDeleteFile = (): Promise<void> => {
    return backendFetch('kb/files/' + file?.file_id, {
      method: 'DELETE'
    })
      .then(_ => router.replace('/kb/' + file?.folder_id))
      .catch(err => {
        console.error(`/kb/files/${file?.file_id}\n${err}`)
        generalErrorToast()
      })
  }

  const handleSaveLearnFile = async (values: z.infer<typeof editDocSchema>) => {
    setIsSaveLoading(true)
    if (file?.name !== values.fileName || file?.content !== values.content) {
      await backendFetch('/kb/files/' + file?.file_id, {
        method: 'PUT',
        body: JSON.stringify({
          name: values.fileName === file?.name ? undefined : values.fileName,
          content: values.content === file?.content ? undefined : values.content
        })
      })
        .then(_ => {
          if (values.content !== file?.content) {
            toast({
              title: 'File was saved!',
              description: 'Let us learn new material'
            })
            return backendFetch(
              '/kb/files/' + file?.file_id + '/embeddings',
              { method: 'PUT' }
            ) as unknown as Promise<void>
          } else {
            return Promise.resolve()
          }
        })
        .catch(err => {
          console.error(`/kb/folders\n${err}`)
          generalErrorToast()
        })
        .finally(() => setIsSaveLoading(false))
    }
    router.push('/kb/files/' + file?.file_id)
  }

  const editDocSchema = z.object({
    fileName: z.string({ required_error: 'File name is required' })
      .min(3, { message: 'File name must me at least 3 characters' })
      .max(60, { message: 'Too long for a file name, try something shorter' }),
    //TODO if name is different from origin, but not unique in the folder
    content: z.string({ required_error: 'File content is required' })
  })

  const form = useForm<z.infer<typeof editDocSchema>>({
    resolver: zodResolver(editDocSchema),
  })

  useEffect(() => {
    form.setValue('fileName', file?.name ?? '')
    form.setValue('content', file?.content ?? '')
  }, [file])

  return (
    <div className="m-2">
      {error && 'Error!'}
      {isLoading && 'Loading...'}
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
                      File name
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
    </div>
  )
}
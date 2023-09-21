'use client'

import InputsDialog, { InputsDialogValues } from "@/components/inputs-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generalErrorToast, toast } from "@/components/ui/use-toast";
import useBackendFetch from "@/hooks/useBackendFetch";
import { FileEntity } from "@/lib/entities";
import { backendFetch } from "@/utils/backendFetch";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditFile({ params }: { params: { fileId: string } }) {
  const { data: file, error, isLoading } = useBackendFetch<FileEntity>('/kb/files/' + params.fileId)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setTitle(file?.name ?? '')
    setContent(file?.content ?? '')
  }, [file])

  const handleDeleteFile = (_?: InputsDialogValues): Promise<void> => {
    return backendFetch('kb/files/' + file?.file_id, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          router.replace('/kb/' + file?.folder_id)
        } else {
          throw new Error
        }
      })
      .catch(err => {
        console.error(`/kb/files/${file?.file_id}\n${err}`)
        generalErrorToast()
      })
  }

  const handleSaveLearnFile = () => { //todo check if content/name is the same
    setIsSaveLoading(true)
    backendFetch('/kb/files/' + file?.file_id, {
      method: 'PUT',
      body: JSON.stringify({
        name: title === file?.name ? undefined : title,
        content: content === file?.content ? undefined : content
      })
    })
      .then(res => {
        if (res.ok) {
          toast({
            title: 'File was saved!',
            description: 'Let us learn new material'
          })
          return backendFetch('/kb/files/' + file?.file_id + '/embeddings', { method: 'PUT' })
        } else {
          throw Error(window.location.href + '\n' + res)
        }
      })
      .catch(err => {
        console.error(`/kb/folders\n${err}`)
        generalErrorToast()
      })
      .finally(() => setIsSaveLoading(false))
  }

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
              <Button onClick={handleSaveLearnFile} disabled={isSaveLoading}>
                {isSaveLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save and Learn
              </Button>
              <InputsDialog
                title="Delete file"
                description={"Are you sure you want to delete file " + file?.name +
                  '? You will lost it and will not be able to recover it ' +
                  'unless you have a local copy.'}
                onSubmit={handleDeleteFile}
                isDestructive
                submitBtnText="Delete"
                asChild
              >
                <Button variant='destructive'>
                  Delete
                </Button>
              </InputsDialog>
            </div>
          </div>
          <hr />
          <Input
            onChange={v => setTitle(v.target.value)}
            value={title}
          />
          <Textarea
            onChange={v => setContent(v.target.value)}
            value={content}
          />
        </div>
      )}
    </div>
  )
}
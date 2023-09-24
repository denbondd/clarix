'use client'

import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generalErrorToast, toast } from "@/components/ui/use-toast";
import useBackendFetch from "@/hooks/useBackendFetch";
import { FileEntity } from "@/lib/entities";
import { backendFetch } from "@/utils/backendFetch";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function File({ params }: { params: { fileId: string } }) {
  const { data: file, error, isLoading } = useBackendFetch<FileEntity>('/kb/files/' + params.fileId)
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
                asChild
              >
                <Link href={'/kb/' + file?.folder_id}>
                  <ChevronLeft />
                </Link>
              </Button>
              <div className="text-lg font-semibold">
                {file?.name}
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href={file?.file_id + '/edit'}>
                  Edit
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
            </div>
          </div>
          <hr />
          <Card className="w-full">
            <ScrollArea className="max-w-[70rem] h-[calc(100vh-150px)] rounded-md">
              <CardContent className="p-4">
                {Array(700).fill(" " + file?.content)}
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  )
}
'use client'

import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generalErrorToast } from "@/components/ui/use-toast";
import WithLoading from "@/components/with-loading";
import { fetchFileContent, findFileById, useFolders } from "@/hooks/data/useFolders";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function File({ params }: { params: { fileId: string } }) {
  const fileId = Number.parseInt(params.fileId)

  const file = useFolders((state) => findFileById(state.folders, fileId))
  const deleteFile = useFolders((state) => state.deleteFile)

  const [fileContent, setFileContent] = useState<string>()
  const [fileContentErr, setFileContentErr] = useState(false)
  useEffect(() => {
    fetchFileContent(fileId)
      .then(answ => setFileContent(answ.content))
      .catch(err => setFileContentErr(true))
  }, [])

  const router = useRouter()

  const handleDeleteFile = (): Promise<void> => {
    return deleteFile(file?.file_id ?? -1)
      .then(_ => router.replace('/kb/' + file?.folder_id))
      .catch(_ => { generalErrorToast() })
  }

  return (
    <div className="m-2">
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
            <Button asChild>
              <Link href={params.fileId + '/edit'}>
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
            <WithLoading error={fileContentErr} data={fileContent}>
              <CardContent className="p-4 whitespace-pre-line">
                {fileContent}
              </CardContent>
            </WithLoading>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}
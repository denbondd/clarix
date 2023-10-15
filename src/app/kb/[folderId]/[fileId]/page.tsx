"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import FileHeader from "./file-header"
import WithLoading from "@/components/with-loading"
import { useFileContent } from "@/hooks/data/useFileContent"

export default function File({
  params,
}: {
  params: { folderId: string; fileId: string }
}) {
  const fileId = Number.parseInt(params.fileId)
  const folderId = Number.parseInt(params.folderId)

  const {
    fileContent,
    isLoading,
    error,
  } = useFileContent(fileId)

  return (
    <div className="m-2">
      <div className="flex gap-2 flex-col items-center">
        <FileHeader fileId={fileId} folderId={folderId} />
        <hr />
        <Card className="w-full">
          <ScrollArea className="max-w-[70rem] h-[calc(100vh-150px)] rounded-md">
            <CardContent className="p-4 whitespace-pre-line">
              <WithLoading data={fileContent} isLoading={isLoading} error={error}>
                {fileContent?.content}
              </WithLoading>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}

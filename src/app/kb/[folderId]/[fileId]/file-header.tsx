"use client"

import ConfirmDialog from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { generalErrorToast } from "@/components/ui/use-toast"

import { useFolders } from "@/hooks/data/useFolders"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function FileHeader({
  fileId,
  folderId,
}: {
  fileId: number
  folderId: number
}) {
  const { folders, deleteFile } = useFolders()
  const file = folders
    ?.find(f => f.folder_id === folderId)
    ?.files.find(f => f.file_id === fileId)

  const router = useRouter()

  const handleDeleteFile = (): Promise<void> => {
    return deleteFile(file?.file_id ?? -1)
      .then(_ => router.replace("/kb/" + file?.folder_id))
      .catch(_ => {
        generalErrorToast()
      })
  }

  return (
    <div className="flex w-full justify-between">
      <div className="flex gap-2 items-center">
        <Button variant="secondary" size="icon" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <div className="text-lg font-semibold">{file?.name}</div>
      </div>
      <div className="flex gap-2">
        <Button asChild>
          <Link href={`/kb/${folderId}/${fileId}/edit`}>Edit</Link>
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
      </div>
    </div>
  )
}

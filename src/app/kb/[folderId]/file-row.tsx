import { TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { FileEntity } from "@/lib/entities"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { backendFetch } from "@/utils/backendFetch"
import { generalErrorToast } from "@/components/ui/use-toast"
import { DialogTrigger } from "@/components/ui/dialog"
import ConfirmDialog from "@/components/confirm-dialog"

export default function FileRow(props: { file: FileEntity, onChangeFolderClick: () => void }) {
  const router = useRouter()

  const handleDeleteFile = (): Promise<void> => {
    return backendFetch('kb/files/' + props.file.file_id, {
      method: 'DELETE'
    })
      .then(_ => window.location.reload())
      .catch(err => {
        console.error(`/kb/files/${props.file.file_id}\n${err}`)
        generalErrorToast()
      })
  }

  const getStatusBadge = (embeddingsCount: number) => {
    return (
      <Badge variant={embeddingsCount > 0 ? 'success' : 'default'}>
        {embeddingsCount > 0 ? 'Learned' : 'New'}
      </Badge>
    )
  }
  return (
    <TableRow>
      <TableCell>{props.file.name}</TableCell>
      <TableCell>
        {getStatusBadge(props.file._count.embeddings)}
      </TableCell>
      <TableCell>{props.file.edited_at}</TableCell>
      <TableCell>{props.file.created_at}</TableCell>
      <TableCell className="flex gap-0">
        <Button
          variant='outline'
          className="rounded-r-none border-r-0"
          asChild
        >
          <Link href={'/kb/files/' + props.file.file_id}>
            View
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant='outline'
              className="p-0 h-10 w-10 rounded-l-none"
              asChild
            >
              <div>
                <MoreVertical size={18} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => router.push('/kb/files/' + props.file.file_id + '/edit')}>
              Edit
            </DropdownMenuItem>
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={props.onChangeFolderClick}>
                Change folder
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <ConfirmDialog
              title="Delete file"
              description={"Are you sure you want to delete file " + props.file.name +
                '? You will lost it and will not be able to recover it ' +
                'unless you have a local copy.'}
              onSubmit={handleDeleteFile}
              isDestructive
              confirmBtnText="Delete"
              asChild
            >
              <DropdownMenuItem variant='destructive' onSelect={(e) => e.preventDefault()}>
                Delete
              </DropdownMenuItem>
            </ConfirmDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
import InputsDialog, { InputsDialogValues } from "@/components/inputs-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { FolderEntity } from "@/lib/entities"
import { backendFetch } from "@/utils/backendFetch"

interface FolderHeaderProps {
  folder: { name: string, folder_id: number },
  openAnyMenu: boolean,
  setOpenAnyMenu: (b: boolean) => void,

}

export default function FolderHeader(props: FolderHeaderProps) {
  const handleFolderDelete = (_?: InputsDialogValues): Promise<void> => {
    return backendFetch('/kb/folders/' + props.folder.folder_id, {
      method: 'DELETE',
    })
      .then(_ => { window.location.href = '/kb' })
      .catch(err => {
        console.error(`/kb/folders\n${err}`)
        toast({
          title: 'Something went wrong(',
          description: 'Please, try again later',
          variant: 'destructive',
        })
      })
  }

  const handleFolderRename = (values?: InputsDialogValues): Promise<void> => {
    if (!values?.folderName) {
      toast({
        title: 'Input folder name'
      })
      return Promise.resolve()
    }
    return backendFetch('/kb/folders/' + props.folder.folder_id, {
      method: 'PUT',
      body: JSON.stringify({
        name: values?.folderName
      })
    })
      .then(_ => { window.location.reload() })
      // .then(res => { if (res.ok) return res.json(); else throw new Error(res.statusText) })
      // .then(json => {
      //   const newFolder = (json as FolderEntity)

      // })
      .catch(err => {
        console.error(`/kb/folders\n${err}`)
        toast({
          title: 'Something went wrong(',
          description: 'Please, try again later',
          variant: 'destructive',
        })
      })
  }

  const deleteDialogDescription =
    'Are you sure you want to delete folder ' + props.folder.name +
    '? You will lost all your files and could not recover them ' +
    'unless you have a local copy.'
  return (
    <DropdownMenu open={props.openAnyMenu} onOpenChange={props.setOpenAnyMenu}>
      <DropdownMenuTrigger className="w-max">
        <Button asChild variant='secondary' className="w-max text-2xl font-semibold">
          <div>
            {props.folder.name}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <InputsDialog
          inputs={[
            {
              name: 'folderName',
              placeholder: 'New name for this folder'
            }
          ]}
          submitBtnText="Rename"
          title="Rename folder"
          onSubmit={handleFolderRename}
          asChild
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Rename
          </DropdownMenuItem>
        </InputsDialog>
        <DropdownMenuSeparator />
        <InputsDialog
          submitBtnText='Delete folder'
          onSubmit={handleFolderDelete}
          isDestructive
          title="Delete folder"
          description={deleteDialogDescription}
          asChild
        >
          <DropdownMenuItem variant='destructive' onSelect={(e) => e.preventDefault()}>
            Delete
          </DropdownMenuItem>
        </InputsDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
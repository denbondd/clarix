'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, MoreVertical } from "lucide-react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import useBackendFetch from "@/hooks/useBackendFetch"
import InputsDialog, { InputsDialogValues } from "@/components/inputs-dialog"
import { toast } from "@/components/ui/use-toast"
import { backendFetch } from "@/utils/backendFetch"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Folder {
  folder_id: number;
  name: string;
  user_id: string;
  created_at: string;
  files: {
    name: string;
    created_at: string;
    file_id: number;
    edited_at: string;
    filestatuses: {
      filestatus_id: number;
      name: string;
    };
  }[];
}

const actions = [
  {
    icon: <Pencil />,
    title: 'Write',
    description: 'Write or copy paste your document'
  }
]

export default function Folder({ params }: { params: { folderId: string } }) {
  const { data: folder, error, isLoading } = useBackendFetch<Folder>('/kb/folders/' + params.folderId)
  const router = useRouter()
  const [openAnyDialog, setOpenAnyDialog] = useState(false)
  const [openAnyMenu, setOpenAnyMenu] = useState(false)
  // let folder = {
  //   "folder_id": 7,
  //   "name": "hahaha",
  //   "created_at": "2023-09-18T00:00:00.000Z",
  //   "user_id": "user_2VP0ILQP8B8gz9xRcfjalh4Vhpn",
  //   "files": []
  // }
  // let error = false
  // let isLoading = false

  const handleCreateNewFile = (values?: InputsDialogValues): Promise<void> => {
    console.log(values)
    if (!values?.fileName) {
      toast({
        title: 'Input file name'
      })
      return Promise.resolve()
    }
    if (!values.content) {
      toast({
        title: 'Input file content'
      })
      return Promise.resolve()
    }
    console.log(values?.fileName + ' ' + values?.content)
    // return backendFetch('/kb/files', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     name: values.fileName,
    //     content: values.content
    //   })
    // })
    //   .then(res => res.json())
    //   .then(json => {
    //     const newFile = (json as {

    //     })
    //   })
    return Promise.resolve()
  }

  const handleFolderRename = (values?: InputsDialogValues): Promise<void> => {
    if (!values?.folderName) {
      toast({
        title: 'Input folder name'
      })
      return Promise.resolve()
    }
    return backendFetch('/kb/folders/' + folder?.folder_id, {
      method: 'PUT',
      body: JSON.stringify({
        name: values?.folderName
      })
    })
      .then(res => res.json())
      .then(json => { window.location.reload() })
      .catch(err => {
        console.error(`/kb/folders\n${err}`)
        toast({
          title: 'Something went wrong(',
          description: 'Please, try again later',
          variant: 'destructive',
        })
      })
  }

  const handleFolderDelete = (values?: InputsDialogValues): Promise<void> => {
    return backendFetch('/kb/folders/' + folder?.folder_id, {
      method: 'DELETE',
    })
      .then(res => { window.location.href = '/kb' })
      .catch(err => {
        console.error(`/kb/folders\n${err}`)
        toast({
          title: 'Something went wrong(',
          description: 'Please, try again later',
          variant: 'destructive',
        })
      })
  }

  const dialogProps = { open: openAnyDialog, onOpenChange: setOpenAnyDialog }

  const getStatusBadge = (fileStatus: string) => {
    if (fileStatus === "Learned")
      return (
        <Badge variant='success'>
          {fileStatus}
        </Badge>
      )
    else return <></>
  }
  if (isLoading) return 'Loading...'
  else if (error) return 'Error'
  else if (folder) return (
    <ScrollArea className="max-h-[calc(100vh-60px)] w-full flex-1">
      <div className="m-2 flex flex-col gap-4">
        <DropdownMenu open={openAnyMenu} onOpenChange={setOpenAnyMenu}>
          <DropdownMenuTrigger className="w-max">
            <Button asChild variant='secondary' className="w-max text-2xl font-semibold">
              <div>
                {folder.name}
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
              description={"Are you sure you want to delete folder " + folder.name +
                '? You will lost all your files and could not recover them ' +
                'unless you have a local copy.'}
              asChild
            >
              <DropdownMenuItem variant='destructive' onSelect={(e) => e.preventDefault()}>
                Delete
              </DropdownMenuItem>
            </InputsDialog>
          </DropdownMenuContent>
        </DropdownMenu>
        <hr />
        <div>
          <h4 className="text-xl font-semibold tracking-tight mb-2">Create Documents</h4>
          <div className="flex flex-col gap-2">
            {actions.map((a, idx) => (
              <InputsDialog
                key={idx}
                asChild
                inputs={[
                  {
                    name: 'fileName',
                    placeholder: 'File name',
                  },
                  {
                    name: 'content',
                    placeholder: 'File content',
                    size: 4
                  }
                ]}
                submitBtnText="Create File"
                title="Create new File"
                onSubmit={handleCreateNewFile}
              >
                <Button asChild variant='ghost' key={idx}>
                  <Card className="block flex-1 cursor-pointer w-max">
                    <CardHeader>
                      {a.icon}
                    </CardHeader>
                    <CardContent>
                      <CardTitle>{a.title}</CardTitle>
                    </CardContent>
                    <CardFooter>
                      <CardDescription>{a.description}</CardDescription>
                    </CardFooter>
                  </Card>
                </Button>
              </InputsDialog>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold tracking-tight mb-2">Stored Documents</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Edited On</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            {(!folder.files || folder.files.length === 0) && (
              <TableCaption>
                NO FILES
              </TableCaption>
            )}
            <TableBody>
              {folder.files.map((f, idx) => (
                <TableRow key={idx}>
                  <TableCell>{f.name}</TableCell>
                  <TableCell>
                    {getStatusBadge(f.filestatuses.name)}
                  </TableCell>
                  <TableCell>{f.edited_at}</TableCell>
                  <TableCell>{f.created_at}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant='ghost' className="p-0 h-10 w-10" asChild>
                          <div>
                            <MoreVertical size={18} />
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <InputsDialog
                            submitBtnText="Rename"
                            inputs={[
                              {
                                name: 'fileName',
                                placeholder: 'File name',
                              }
                            ]}
                            onSubmit={(p) => new Promise((res, rej) => console.log(p?.fileName))}
                            title="Rename file"
                          >
                            Rename
                          </InputsDialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Edit content
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Change folder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant='destructive'>
                          <InputsDialog
                            title="Delete file"
                            description={"Are you sure you want to delete file " + f.name +
                              '? You will lost it and will not be able to recover it ' +
                              'unless you have a local copy.'}
                            onSubmit={(p) => new Promise((res, rej) => console.log('hahaha'))}
                            isDestructive
                            submitBtnText="Delete"
                          >
                            Delete
                          </InputsDialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

    </ScrollArea >
  )
}
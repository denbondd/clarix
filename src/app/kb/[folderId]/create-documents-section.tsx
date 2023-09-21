'use client'

import { InputsDialogValues } from "@/components/inputs-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { FileEntity } from "@/lib/entities"
import { backendFetch } from "@/utils/backendFetch"
import { Loader2, Pencil } from "lucide-react"
import { useState } from "react"

interface CreateDocuementsSectionProps {
  folderId: string,
  onCreate: (file: FileEntity) => void
}

export default function CreateDocuementsSection(props: CreateDocuementsSectionProps) {
  const [fileName, setFileName] = useState('')
  const [content, setContent] = useState('')

  const [openDialog, setOpenDialog] = useState(false)
  const [isLoading, setIsloading] = useState(false)

  const handleCreateNewFile = () => {
    if (!fileName) {
      toast({
        title: 'Input file name'
      })
      return Promise.resolve()
    }
    if (!content) {
      toast({
        title: 'Input file content'
      })
      return Promise.resolve()
    }

    setIsloading(true)
    return backendFetch('/kb/files', {
      method: 'POST',
      body: JSON.stringify({
        name: fileName,
        content: content,
        folderId: Number.parseInt(props.folderId)
      })
    })
      // .then(_ => window.location.reload)
      .then(res => res.json())
      .then(json => {
        const newFile = json as {
          file_id: number;
          name: string;
          folder_id: number;
          created_at: string;
          edited_at: string;
          content: string;
        }
        toast({
          title: 'File was created!',
          description: 'Now give us some time to learn it',
          variant: 'default'
        })
        return backendFetch('/kb/files/' + newFile.file_id + '/embeddings', { method: 'PUT' })
          .then(_ => {
            props.onCreate({
              file_id: newFile.file_id,
              name: newFile.name,
              created_at: newFile.created_at,
              edited_at: newFile.edited_at,
              folder_id: newFile.folder_id,
              content: newFile.content,
              _count: {
                embeddings: 1 //more then 0, so learned
              }
            })
            setOpenDialog(false)
          })
      })
      .finally(() => setIsloading(false))
  }

  return (
    <div>
      <h4 className="text-xl font-semibold tracking-tight mb-2">Create Documents</h4>
      <div className="flex flex-col gap-2">
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button asChild variant='ghost'>
              <Card className="block flex-1 cursor-pointer w-max">
                <CardHeader>
                  <Pencil />
                </CardHeader>
                <CardContent>
                  <CardTitle>Write</CardTitle>
                </CardContent>
                <CardFooter>
                  <CardDescription>Write or copy paste your document</CardDescription>
                </CardFooter>
              </Card>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Create new File
              </DialogTitle>
            </DialogHeader>
            <Label>File name</Label>
            <Input
              placeholder="File name"
              value={fileName}
              onChange={v => setFileName(v.target.value)}
            />
            <hr />
            <Label>File content</Label>
            <Textarea
              placeholder="File content"
              value={content}
              onChange={v => setContent(v.target.value)}
            />
            <DialogFooter>
              <DialogTrigger asChild>
                <Button variant='secondary'>
                  Cancel
                </Button>
              </DialogTrigger>
              <Button
                onClick={handleCreateNewFile}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create file
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
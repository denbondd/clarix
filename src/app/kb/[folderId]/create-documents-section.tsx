'use client'

import { LoadingButton } from "@/components/loading-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { generalErrorToast, toast } from "@/components/ui/use-toast"
import { useFolders } from "@/hooks/data/useFolders"

import { FolderEntity } from "@/lib/entities"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from 'zod'

interface CreateDocuementsSectionProps {
  folder: FolderEntity
}

export default function CreateDocumentsSection(props: CreateDocuementsSectionProps) {
  const createFile = useFolders((state) => state.createFile)

  const [openDialog, setOpenDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateNewFile = (values: z.infer<typeof createDocSchema>) => {
    setIsLoading(true)
    createFile({
      content: values.content,
      fileName: values.fileName,
      folderId: props.folder.folder_id
    }, () => toast({
      title: 'File was created!',
      description: 'Now give us some time to learn it',
      variant: 'default'
    }))
      .then(_ => setOpenDialog(false))
      .catch(_ => generalErrorToast())
      .finally(() => setIsLoading(false))
  }

  const createDocSchema = z.object({
    fileName: z.string({ required_error: 'File name is required' })
      .min(3, { message: 'File name must me at least 3 characters' })
      .max(60, { message: 'Too long for a file name, try something shorter' })
      .refine(
        name => !props.folder.files.find(f => f.name == name),
        { message: 'File with this name already exists in this folder' }
      ),
    content: z.string({ required_error: 'File content is required' })
  })

  const form = useForm<z.infer<typeof createDocSchema>>({
    resolver: zodResolver(createDocSchema),
  })

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateNewFile)}>
                <FormField
                  control={form.control}
                  name="fileName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Folder name
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
                        Folder name
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder='File content' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="mt-4">
                  <DialogTrigger asChild>
                    <Button variant='secondary' >
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <LoadingButton isLoading={isLoading} type="submit">
                    Create
                  </LoadingButton>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
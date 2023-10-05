'use client'

import { useEffect, useState } from "react";
import { backendFetch } from "@/utils/backendFetch";

import { generalErrorToast } from "@/components/ui/use-toast";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FolderPlus } from "lucide-react";

import * as z from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingButton } from "@/components/loading-button";
import { useFolders } from "@/hooks/data/useFolders";
import { FolderEntity } from "@/lib/entities";
import Link from "next/link";
import { useRouter } from "next/navigation";
import WithLoading from "@/components/with-loading";

export default function KbLayout(props: { children: React.ReactNode }) {
  const allFolders = useFolders((state) => state.folders)
  const foldersError = useFolders((state) => state.foldersError)

  const [searchFolderName, setSearchFolderName] = useState('')
  const [folders, setFolders] = useState<FolderEntity[]>()
  const [isAddBtnLoading, setIsAddBtnLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (!searchFolderName)
      setFolders(allFolders)
    else
      setFolders(allFolders?.filter(f => f.name.toLowerCase().includes(searchFolderName.toLowerCase())))
  }, [searchFolderName, allFolders])

  const onSubmit = (values: z.infer<typeof createFolderSchema>) => {
    setIsAddBtnLoading(true)
    return backendFetch('/kb/folders', {
      method: 'POST',
      body: JSON.stringify({ name: values.folderName })
    })
      .then(resp => resp.json())
      .then(json => {
        const newFold = (json as {
          folder_id: number,
          name: string,
          user_id: string,
          created_at: Date
        })
        router.push('/kb/' + newFold.folder_id)
      })
      .catch(err => {
        console.error(err)
        generalErrorToast()
      })
      .finally(() => setIsAddBtnLoading(false))
  }

  const createFolderSchema = z.object({
    folderName: z.string({ required_error: 'Folder name is required' })
      .min(3, { message: 'Folder name must me at least 3 characters' })
      .max(60, { message: 'Too long for a folder name, try something shorter' })
      .refine(
        name => !folders?.find(f => f.name == name),
        { message: 'Folder with this name already exists' }
      )
  })

  const form = useForm<z.infer<typeof createFolderSchema>>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      folderName: ''
    }
  })

  return (
    <div className="flex w-full h-full">
      <Sidebar className='max-w-xs'>
        <div className="flex w-full gap-1 items-center mb-4">
          <Input
            placeholder="Search folder"
            value={searchFolderName}
            onChange={(inp) => setSearchFolderName(inp.target.value)}
          />

          <Dialog onOpenChange={(_) => form.reset()}>
            <DialogTrigger asChild>
              <Button size='icon' className="flex-none">
                <FolderPlus size={22} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Create Folder
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="folderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Folder name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder='Folder name' {...field} />
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
                    <LoadingButton isLoading={isAddBtnLoading} type="submit">
                      Create
                    </LoadingButton>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className=" flex flex-col gap-2">
          <WithLoading data={allFolders} error={foldersError}>
            {folders && folders.length === 0 && !searchFolderName && 'You have no folders yet(('}
            {folders && folders.length > 0 && folders
              .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))
              .map((f, idx) => (
                <Button asChild variant='outline' className="justify-start" key={idx}>
                  <Link href={'/kb/' + f.folder_id} className="flex justify-between">
                    <div>{f.name}</div>
                    <div>{f.files.length}</div>
                  </Link>
                </Button>
              ))}
          </WithLoading>
        </div>
      </Sidebar>
      <div className="max-w-6xl w-full mx-auto">
        {props.children}
      </div>
    </div>
  )
}
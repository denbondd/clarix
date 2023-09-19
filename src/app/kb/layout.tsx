'use client'

import useBackendFetch from "@/hooks/useBackendFetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { backendFetch } from "@/utils/backendFetch";

import { toast } from "@/components/ui/use-toast";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FolderPlus } from "lucide-react";
import InputsDialog from "@/components/inputs-dialog";

interface Folder {
  folder_id: number,
  name: string,
  user_id: string,
  created_at: string,
  _count: {
    files: number,
  }
}

export default function KbLayout(props: { children: React.ReactNode }) {
  const { data: allFolders, error, isLoading } = useBackendFetch<Folder[]>('/kb/folders')
  const [searchFolderName, setSearchFolderName] = useState('')
  const [folders, setFolders] = useState<Folder[]>()

  const router = useRouter()

  useEffect(() => setFolders(allFolders), [allFolders])
  useEffect(() => {
    if (!searchFolderName)
      setFolders(allFolders)
    else
      setFolders(allFolders?.filter(f => f.name.includes(searchFolderName)))
  }, [searchFolderName])

  const handleAddFolder = (name: string): Promise<void> => {
    console.log(name)
    if (!name) {
      toast({
        title: 'Input folder name'
      })
      return Promise.resolve()
    }

    if (folders && folders.find(f => f.name == name)) {
      toast({
        title: 'Folder with this name already exists',
        description: 'Try another name',
        variant: 'destructive'
      })
      return Promise.resolve()
    }

    return backendFetch('/kb/folders', {
      method: 'POST',
      body: JSON.stringify({ name: name })
    })
      .then(resp => resp.json())
      .then(json => {
        const newFold = (json as {
          folder_id: number,
          name: string,
          user_id: string,
          created_at: Date
        })
        // router.push('/kb/' + newFold.folder_id) //TODO make trhough router to save resources (need to update folders with new one, close dialog and then use router)
        window.location.href = '/kb/' + newFold.folder_id
      })
      .catch(err => {
        console.error(`/kb/folders\n${err}`)
        toast({
          title: 'Something went wrong(',
          description: 'Please, try again later',
          variant: 'destructive',
        })
      })
  }

  return (
    <div className="flex w-full h-full">
      <Sidebar className='max-w-xs'>
        <div className="flex w-full items-center mb-4">
          <Input
            className="m-1"
            placeholder="Search folder"
            value={searchFolderName}
            onChange={(inp) => setSearchFolderName(inp.target.value)}
          />

          <InputsDialog
            title="Create Folder"
            submitBtnText="Create"
            inputs={[
              {
                name: 'folderName',
                placeholder: 'Folder name'
              }
            ]}
            onSubmit={v => handleAddFolder(v?.folderName as string)}
          >
            <Button asChild size='icon'>
              <div>
                <FolderPlus size={22} />
              </div>
            </Button>
          </InputsDialog>
        </div>
        <div className=" flex flex-col gap-2">
          {isLoading && <h2>Loading...</h2>}
          {error && <h2>Error!</h2>}
          {folders && folders.length === 0 && !searchFolderName && 'You have no folders yet(('}
          {folders && folders.length > 0 && folders
            .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))
            .map((f, idx) => (
              <Button asChild variant='outline' className="justify-start" key={idx}>
                <a href={'/kb/' + f.folder_id}>{f.name} || {f._count.files}</a>
              </Button>
            ))}
        </div>
      </Sidebar>
      <div className="max-w-6xl w-full mx-auto">
        {props.children}
      </div>
    </div>
  )
}
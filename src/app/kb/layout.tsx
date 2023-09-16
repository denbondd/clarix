import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderPlus } from "lucide-react";

const folders = [
  'folder1', 'folder2', 'folder3', 'folder4',
  'folder1', 'folder2', 'folder3', 'folder4',
  'folder1', 'folder2', 'folder3', 'folder4',
  'folder1', 'folder2', 'folder3', 'folder4',
]

export default function KbLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-full">
      <Sidebar>
        <div className="flex w-full max-w-sm items-center gap-1 mb-4">
          <Input placeholder="Search folder" />
          <Button className="w-12 p-0">
            <FolderPlus size={20} />
          </Button>
        </div>
        <div className=" flex flex-col gap-2">
          {folders.map((c, idx) => (
            <Button asChild variant='outline' className="justify-start" key={idx}>
              <a href={c}>{c}</a>
            </Button>
          ))}
        </div>
      </Sidebar>
      <ScrollArea className="max-h-[calc(100vh-60px)] w-full">
        <div className="max-w-6xl w-full mx-auto">
          {props.children}
        </div>
      </ScrollArea>
    </div>
  )
}
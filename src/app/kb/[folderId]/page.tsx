"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import WithLoading from "@/components/with-loading"
import { useFolders } from "@/hooks/data/useFolders"
import { useState } from "react"
import CreateDocumentsSection from "./create-documents-section"
import FileRow from "./file-row"
import FolderHeader from "./folder-header"

export default function FolderElem({
  params,
}: {
  params: { folderId: string }
}) {
  const folderId = Number.parseInt(params.folderId)

  const { folders, isLoading, error } = useFolders()
  const folder = folders?.find(f => f.folder_id === folderId)

  const [openAnyMenu, setOpenAnyMenu] = useState(false)

  return (
    <WithLoading data={folder} isLoading={isLoading} error={error}>
      <ScrollArea className="max-h-[calc(100vh-60px)] w-full flex-1">
        {folder && (
          <div className="m-2 flex flex-col gap-4">
            <FolderHeader
              folder={folder}
              openAnyMenu={openAnyMenu}
              setOpenAnyMenu={setOpenAnyMenu}
            />
            <hr />
            <CreateDocumentsSection folder={folder} />

            <div>
              <h4 className="text-xl font-semibold tracking-tight mb-2">
                Stored Documents
              </h4>
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
                  <TableCaption>NO FILES</TableCaption>
                )}
                <TableBody>
                  {folder.files.map((f, idx) => (
                    <FileRow file={f} key={idx} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </ScrollArea>
    </WithLoading>
  )
}

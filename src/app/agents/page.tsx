'use client'

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import EditAgentDialogContent, { AgentParams } from "./edit-agent-dialog-content"
import useBackendFetch from "@/hooks/useBackendFetch"
import { AgentEntity, FolderEntity, ModelEntity } from "@/lib/entities"
import { useState } from "react"
import WithLoading from "@/components/with-loading"
import { backendFetch } from "@/utils/backendFetch"
import { generalErrorToast } from "@/components/ui/use-toast"

export default function Agents() {
  const [editAgent, setEditAgent] = useState<AgentEntity>()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { data: allAgents, setData: setAllAgents, error, isLoading } = useBackendFetch<AgentEntity[]>('/agents')
  const { data: allModels } = useBackendFetch<ModelEntity[]>('/models')
  const { data: allFolders } = useBackendFetch<FolderEntity[]>('/kb/folders')

  const handleCreateAgent = (values: AgentParams) => {
    return backendFetch('/agents', {
      method: "POST",
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(json => {
        const newAgent = (json as AgentEntity)
        setAllAgents([newAgent, ...allAgents as AgentEntity[]])
        setIsCreateOpen(false)
      })
      .catch(err => {
        console.error(`/agents create\n${err}`)
        generalErrorToast()
      })
  }

  const handleEditAgent = (values: AgentParams) => {
    return backendFetch('/agents/' + editAgent?.agent_id, {
      method: "PUT",
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(json => {
        const newAgent = (json as AgentEntity)
        setAllAgents(allAgents?.map(ag => ag.agent_id === newAgent.agent_id ? newAgent : ag))
        setIsEditOpen(false)
      })
      .catch(err => {
        console.error(`/agents edit\n${err}`)
        generalErrorToast()
      })
  }

  return (
    <WithLoading data={allAgents} error={error} isLoading={isLoading}>
      <div className="max-w-7xl w-full mx-auto my-2 flex flex-col gap-2">
        <div className="flex gap-3 justify-between items-center">
          <div className="font-semibold tracking-tight text-2xl">
            Agents
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus />
                Add Agent
              </Button>
            </DialogTrigger>
            <EditAgentDialogContent
              type="create"
              folders={allFolders}
              models={allModels}
              tookNames={allAgents?.map(a => a.name) ?? []}
              onSubmit={handleCreateAgent}
            />
          </Dialog>
        </div>
        <Separator />
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <div className="flex gap-2 flex-wrap align-middle justify-center lg:justify-start">
            {allAgents?.map((ag, idx) => (
              <Card key={idx} className="flex-1 min-w-[18rem] max-w-md flex flex-col justify-between">
                <CardHeader className="text-center">
                  <CardTitle>{ag.name}</CardTitle>
                  <Badge className="w-max mx-auto">{ag.models.name}</Badge>
                </CardHeader>
                <CardContent>
                  {ag.description}
                </CardContent>
                <CardFooter className="justify-center flex-col">
                  <div className="text-center text-muted-foreground text-sm my-2">
                    Created On: {ag.created_on.toString()}
                  </div>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditAgent(ag)}>
                      Edit
                    </Button>
                  </DialogTrigger>
                </CardFooter>
              </Card>
            ))}
            {(!allAgents || allAgents.length === 0) && (
              <div className="text-lg text-center text-muted-foreground w-full mt-4">
                You have no Agents yet. Tap Add Agent to create one
              </div>
            )}
          </div>
          <EditAgentDialogContent
            type="edit"
            agent={editAgent}
            folders={allFolders}
            models={allModels}
            tookNames={allAgents?.map(a => a.name) ?? []}
            onSubmit={handleEditAgent}
          />
        </Dialog>
      </div>
    </WithLoading>
  )
}
"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import WithLoading from "@/components/with-loading"
import { generalErrorToast } from "@/components/ui/use-toast"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import EditAgentDialogContent, {
  AgentParams,
} from "./edit-agent-dialog-content"
import { AgentEntity } from "@/lib/entities"
import { useState } from "react"

import { useAgents } from "@/hooks/data/useAgents"
import { useModels } from "@/hooks/data/useModels"
import { useFolders } from "@/hooks/data/useFolders"
import { parseDateStr } from "@/lib/utils"

export default function AgentsContent() {
  const { agents, isLoading, error, createAgent, editAgent } = useAgents()
  const { models } = useModels()
  const { folders } = useFolders()

  const [editAgentObj, setEditAgentObj] = useState<AgentEntity>()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const handleCreateAgent = (values: AgentParams) => {
    return createAgent(values)
      .then(_ => setIsCreateOpen(false))
      .catch(_ => {
        generalErrorToast()
      })
  }

  const handleEditAgent = (values: AgentParams) => {
    return editAgent(editAgentObj?.agent_id as number, values)
      .then(_ => setIsEditOpen(false))
      .catch(_ => {
        generalErrorToast()
      })
  }

  return (
    <WithLoading data={agents} isLoading={isLoading} error={error}>
      <div className="mx-2">
        <div className="max-w-7xl w-full mx-auto my-2 flex flex-col gap-2">
          <div className="flex gap-3 justify-between items-center">
            <div className="font-semibold tracking-tight text-2xl">Agents</div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus />
                  Add Agent
                </Button>
              </DialogTrigger>
              <EditAgentDialogContent
                type="create"
                folders={folders}
                models={models}
                tookNames={agents?.map(a => a.name) ?? []}
                onSubmit={handleCreateAgent}
              />
            </Dialog>
          </div>
          <Separator />
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <div className="flex gap-2 flex-wrap align-middle justify-center lg:justify-start">
              {agents?.map((ag, idx) => (
                <Card
                  key={idx}
                  className="flex-1 min-w-[18rem] max-w-md flex flex-col justify-between"
                >
                  <CardHeader className="text-center">
                    <CardTitle>{ag.name}</CardTitle>
                    <Badge className="w-max mx-auto">{ag.models.name}</Badge>
                  </CardHeader>
                  <CardContent>{ag.description}</CardContent>
                  <CardFooter className="justify-center flex-col">
                    <div className="text-center text-muted-foreground text-sm my-2">
                      Created On:{" "}
                      {parseDateStr(ag.created_on, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <DialogTrigger asChild>
                      <Button onClick={() => setEditAgentObj(ag)}>Edit</Button>
                    </DialogTrigger>
                  </CardFooter>
                </Card>
              ))}
              {(!agents || agents.length === 0) && (
                <div className="text-lg text-center text-muted-foreground w-full mt-4">
                  You have no Agents yet. Tap Add Agent to create one
                </div>
              )}
            </div>
            <EditAgentDialogContent
              type="edit"
              agent={editAgentObj}
              folders={folders}
              models={models}
              tookNames={agents?.map(a => a.name) ?? []}
              onSubmit={handleEditAgent}
            />
          </Dialog>
        </div>
      </div>
    </WithLoading>
  )
}

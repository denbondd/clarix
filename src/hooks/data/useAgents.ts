import useSWR from "swr"
import { fetcher } from "./common"
import { AgentParams } from "@/app/agents/edit-agent-dialog-content"
import { backendFetch } from "@/utils/backendFetch"
import { AgentEntity } from "@/lib/entities"

export const useAgents = () => {
  const {
    data: agents,
    isLoading,
    error,
    mutate,
  } = useSWR<AgentEntity[]>("/api/agents", fetcher)

  const createAgent = async (values: AgentParams) => {
    return backendFetch("/api/agents", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then(res => res.json())
      .then(json => {
        const newAgent = json as AgentEntity
        mutate([newAgent, ...(agents ?? [])])
      })
      .catch(err => {
        console.error(`/api/agents create\n${err}`)
        throw err
      })
  }

  const editAgent = async (agentId: number, values: AgentParams) => {
    return backendFetch("/api/agents/" + agentId, {
      method: "PUT",
      body: JSON.stringify(values),
    })
      .then(res => res.json())
      .then(json => {
        const newAgent = json as AgentEntity
        mutate(
          agents?.map(ag => (ag.agent_id === newAgent.agent_id ? newAgent : ag))
        )
      })
      .catch(err => {
        console.error(`/agents edit\n${err}`)
        throw err
      })
  }

  return {
    agents,
    isLoading,
    error,
    createAgent,
    editAgent
  }
}

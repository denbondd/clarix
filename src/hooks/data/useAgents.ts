import { AgentParams } from '@/app/agents/edit-agent-dialog-content'
import { generalErrorToast } from '@/components/ui/use-toast'
import { AgentEntity } from '@/lib/entities'
import { backendFetch } from '@/utils/backendFetch'
import { create } from 'zustand'
import { fetchStateData } from './common'

interface AgentsState {
  agents: AgentEntity[] | undefined,
  agentsError: boolean,
  createAgent: (values: AgentParams) => Promise<void>
  editAgent: (values: AgentParams, agentId: number) => Promise<void>
}

export const useAgents = create<AgentsState>((set, get) => ({
  agents: undefined,
  agentsError: false,
  createAgent: (values) => backendFetch('/agents', {
    method: "POST",
    body: JSON.stringify(values)
  })
    .then(res => res.json())
    .then(json => {
      const newAgent = (json as AgentEntity)
      set({ agents: [newAgent, ...get().agents as AgentEntity[]] })
    })
    .catch(err => {
      console.error(`/agents create\n${err}`)
      generalErrorToast()
      throw err
    }),
  editAgent: (values, agentId) => backendFetch('/agents' + agentId, {
    method: "PUT",
    body: JSON.stringify(values)
  })
    .then(res => res.json())
    .then(json => {
      const newAgent = (json as AgentEntity)
      set({ agents: get().agents?.map(ag => ag.agent_id === newAgent.agent_id ? newAgent : ag) })
    })
    .catch(err => {
      console.error(`/agents edit\n${err}`)
      throw err
    })
}))

fetchStateData(
  '/agents',
  json => useAgents.setState({ agents: json }),
  error => useAgents.setState({ agentsError: error })
)()
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import EditAgentDialogContent from "./edit-agent-dialog-content"

interface Agent {
  name: string,
  description: string,
  model: string,
  createdOn: string
}

const agents: Agent[] = [
  {
    name: 'Barcelona Customer Support Bot',
    description: '-',
    model: 'OpenAI GPT-3.5',
    createdOn: 'Sep 16, 2023'
  },
  {
    name: 'Factual Cody Factual Cody Factual Cody Factual Cody Factual Cody',
    description: 'Only generates responses based on what it can find in its knowledge base.',
    model: 'OpenAI GPT-3.5',
    createdOn: 'Sep 15, 2023'
  },
  {
    name: 'Creative Cody',
    description: 'Can do creative work like generating ads and slogans.',
    model: 'OpenAI GPT-3.5',
    createdOn: 'Sep 15, 2023'
  },
  {
    name: 'Creative Cody',
    description: 'Can do creative work like generating ads and slogans.',
    model: 'OpenAI GPT-3.5',
    createdOn: 'Sep 15, 2023'
  },
  {
    name: 'Creative Cody',
    description: 'Can do creative work like generating ads and slogans.',
    model: 'OpenAI GPT-3.5',
    createdOn: 'Sep 15, 2023'
  }
]

const folders = [
  {
    folder_id: 1,
    name: 'folder1'
  },
  {
    folder_id: 3,
    name: 'dadada'
  },
  {
    folder_id: 5,
    name: 'someName here'
  },
]

const models = [
  {
    name: 'ChatGPT 3.5-turbo',
  },
  {
    name: 'ChatGPT 4',
  },
]

export default function Agents() {
  return (
    <div className="max-w-7xl w-full mx-auto my-2 flex flex-col gap-2">
      <div className="flex gap-3 justify-between items-center">
        <div className="font-semibold tracking-tight text-2xl">
          Agents
        </div>
        <Dialog>
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
          />
        </Dialog>
      </div>
      <Separator />
      <Dialog>
        <div className="flex gap-2 flex-wrap align-middle justify-center lg:justify-start">
          {agents.map((v, idx) => (
            <Card key={idx} className="flex-1 min-w-[18rem] max-w-md flex flex-col justify-between">
              <CardHeader className="text-center">
                <CardTitle>{v.name}</CardTitle>
                <Badge className="w-max mx-auto my-1">{v.model}</Badge>
              </CardHeader>
              <CardContent>
                {v.description}
              </CardContent>
              <CardFooter className="justify-center flex-col">
                <div className="text-center text-muted-foreground text-sm my-2">
                  Created On: {v.createdOn}
                </div>
                <DialogTrigger asChild>
                  <Button>Edit</Button>
                </DialogTrigger>
              </CardFooter>
            </Card>
          ))}
        </div>
        <EditAgentDialogContent
          type="edit"
          folders={folders}
          models={models}
        />
      </Dialog>
    </div>
  )
}
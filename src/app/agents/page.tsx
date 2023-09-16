import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    name: 'Factual Cody',
    description: 'Only generates responses based on what it can find in its knowledge base.',
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

export default function Agents() {
  return (
    <div className="max-w-7xl w-full mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((v, idx) => (
            <TableRow key={idx}>
              <TableCell>{v.name}</TableCell>
              <TableCell>{v.description}</TableCell>
              <TableCell>{v.model}</TableCell>
              <TableCell>{v.createdOn}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant='outline' className="p-0 h-10 w-10" asChild>
                      <div>
                        <MoreVertical size={18} />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant='destructive'>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
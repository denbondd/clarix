import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, MoreVertical } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface Document {
  name: string,
  status: string,
  editedOn: string,
  createdOn: string
}

const documents: Document[] = [
  {
    name: 'Barcelona',
    status: 'LEARNED',
    editedOn: 'Sep 16, 2023 10:21 AM',
    createdOn: 'Sep 16, 2023 10:21 AM'
  },
  {
    name: 'Barcelona',
    status: 'LEARNED',
    editedOn: 'Sep 16, 2023 10:21 AM',
    createdOn: 'Sep 16, 2023 10:21 AM'
  },
  {
    name: 'Barcelona',
    status: 'LEARNED',
    editedOn: 'Sep 16, 2023 10:21 AM',
    createdOn: 'Sep 16, 2023 10:21 AM'
  },
  {
    name: 'Barcelona',
    status: 'LEARNED',
    editedOn: 'Sep 16, 2023 10:21 AM',
    createdOn: 'Sep 16, 2023 10:21 AM'
  },
]

export default function Kb() {
  const actions = [
    {
      icon: <Pencil />,
      title: 'Write',
      description: 'Write or copy paste your document'
    }
  ]

  return (
    <div className="m-2 flex flex-col gap-4">
      <div>
        <h4 className="text-xl font-semibold tracking-tight mb-2">Create Documents</h4>
        <div className="flex flex-col gap-2">
          {actions.map((a, idx) => (
            <Button asChild variant='ghost' key={idx}>
              <Card className="block flex-1 cursor-pointer w-max">
                <CardHeader>
                  {a.icon}
                </CardHeader>
                <CardContent>
                  <CardTitle>{a.title}</CardTitle>
                </CardContent>
                <CardFooter>
                  <CardDescription>{a.description}</CardDescription>
                </CardFooter>
              </Card>
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xl font-semibold tracking-tight mb-2">Stored Documents</h4>
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
          <TableBody>
            {documents.map((v, idx) => (
              <TableRow key={idx}>
                <TableCell>{v.name}</TableCell>
                <TableCell>
                  <Badge variant='success'>
                    {v.status}
                  </Badge>
                </TableCell>
                <TableCell>{v.editedOn}</TableCell>
                <TableCell>{v.createdOn}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant='ghost' className="p-0 h-10 w-10" asChild>
                        <div>
                          <MoreVertical size={18} />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Edit content
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Change folder
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
    </div>
  )
}
'use client'

import { UserButton, useAuth } from '@clerk/nextjs'
import { MessageSquare, Bot, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Tab {
  title: string,
  href: string,
  icon: JSX.Element,
}

const tabs: Tab[] = [
  {
    title: 'Chat',
    href: '/chat',
    icon: <MessageSquare />
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: <Bot />
  },
  {
    title: 'Knowledge Base',
    href: '/kb',
    icon: <FileText />
  },
]

export default function Toolbar() {
  const { isSignedIn } = useAuth()
  const currentPath = usePathname()

  const currentTab = tabs.find(t => currentPath.startsWith(t.href)) as Tab

  if (!isSignedIn) {
    return <></>
  } else {
    return (
      <div className='flex p-2 justify-between bg-background border-b-secondary border-b-solid border-b-2'>
        <div className='hidden sm:flex w-max gap-2'>
          {tabs.map((t, idx) => (
            <div key={idx}>
              <Button
                asChild
                variant='outline'
                className={currentPath.startsWith(t.href) ? 'bg-accent' : 'bg-background'}
              >
                <Link href={t.href} className='flex gap-1'>
                  {t.icon} {t.title}
                </Link>
              </Button>
            </div>
          ))}
        </div>
        <div className='sm:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button asChild variant='outline'>
                <Link href={currentTab.href} className='flex gap-1'>
                  {currentTab.icon} {currentTab.title} <ChevronRight size={16} />
                </Link>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex flex-col gap-1'>
              {tabs.map((t, idx) => (
                <DropdownMenuItem key={idx} asChild>
                  <Link href={t.href} className='flex gap-1 w-full h-full'>
                    {t.icon} {t.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <UserButton />
      </div>
    )
  }
}
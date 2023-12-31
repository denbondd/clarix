"use client"

import { MessageSquare, Bot, FileText, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"

interface Tab {
  title: string
  href: string
  icon: JSX.Element
}

const tabs: Tab[] = [
  {
    title: "Chat",
    href: "/chat",
    icon: <MessageSquare strokeWidth={1.5} />,
  },
  {
    title: "Agents",
    href: "/agents",
    icon: <Bot strokeWidth={1.5} />,
  },
  {
    title: "Knowledge Base",
    href: "/kb",
    icon: <FileText strokeWidth={1.5} />,
  },
]

export default function Toolbar() {
  const session = useSession()
  const currentPath = usePathname()

  const [currentTab, setCurrentTab] = useState<Tab>()

  useEffect(
    () => setCurrentTab(tabs.find(t => currentPath.startsWith(t.href))),
    [currentPath]
  )

  if (session.status === "unauthenticated") {
    return <></>
  } else {
    return (
      <div className="flex p-2 justify-between bg-background border-b-secondary border-b-solid border-b-2">
        <div className="hidden sm:flex w-max gap-2">
          {tabs.map((t, idx) => (
            <div key={idx}>
              <Button
                asChild
                variant="outline"
                className={
                  currentPath.startsWith(t.href) ? "bg-accent" : "bg-background"
                }
              >
                <Link href={t.href} className="flex gap-1">
                  {t.icon} {t.title}
                </Link>
              </Button>
            </div>
          ))}
        </div>
        <div className="sm:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div
                className={
                  "flex gap-1 " + buttonVariants({ variant: "outline" })
                }
              >
                {currentTab && (
                  <>
                    {currentTab.icon} {currentTab.title}
                  </>
                )}
                {!currentTab && <>Menu</>}
                <ChevronRight size={16} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-1">
              {tabs.map((t, idx) => (
                <DropdownMenuItem key={idx} asChild>
                  <Link href={t.href} className="flex gap-1 w-full h-full">
                    {t.icon} {t.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              {session.data?.user && (
                <Image
                  className="rounded-full"
                  alt="user-avater"
                  src={session.data.user.image ?? ""}
                  width={36}
                  height={36}
                />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => signOut()}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }
}

'use client'

import { MessageEntity } from "@/lib/entities"
import type { UserResource } from '@clerk/types'
import Image from "next/image"
import { LogoIcon } from "@/components/ui/icons/icons"
import { FileText } from "lucide-react"
import Link from "next/link"

export default function Message({ msg, user, pathname }: { user?: UserResource | null, msg: MessageEntity, pathname: string }) {
  const fileIds = new Set(msg.msg_sources.map(s => s.file.id))
  const srcElements = Array.from(fileIds).map(fid => {
    const firstElem = msg.msg_sources.find(f => f.file.id === fid)
    if (!firstElem) throw Error('Unexpected behavior') // should not raise sinse we literally push and pull same values from a set
    return {
      name: firstElem?.file.name,
      href: pathname + '?' + new URLSearchParams([['msg', msg.message_id.toString()], ['src', firstElem.embedding_id.toString()]])
    }
  })

  return (
    <div className={"p-4 flex flex-col items-center w-full " + (msg.role === 'user' ? 'bg-background' : 'bg-secondary')}>
      <div className="max-w-5xl w-full flex flex-col gap-2">
        <div className="flex gap-4 items-start">
          <div className="flex-none rounded-md overflow-hidden sticky top-2">
            {msg.role === 'user' ?
              <Image
                src={user?.imageUrl ?? ''}
                alt="avatar"
                width={36}
                height={36}
              />
              :
              <div className="w-9 h-9 bg-primary flex items-center justify-center">
                <LogoIcon size={24} color="hsl(var(--primary-foreground))" />
              </div>
            }
          </div>
          {msg.content}
        </div>
        {msg.msg_sources && msg.msg_sources.length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground h-max mb-1">
              Answer based on these files:
            </div>
            <div className="flex gap-x-4 gap-y-1 flex-wrap">
              {srcElements.map(s => (
                <Link
                  href={s.href}
                  className="flex gap-1 items-center"
                >
                  <FileText size={12} />
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
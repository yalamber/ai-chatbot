'use client'

import * as React from 'react'
import { nanoid } from 'nanoid'
import { usePathname, notFound } from 'next/navigation'
import Link from 'next/link'
import { useUIState, useAIState } from 'ai/rsc'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { LibraryChat } from '@/components/library-chat'
import { Library, Chat, Session } from '@/lib/types'

interface LibraryPageProps {
  threadId: string
  userId: string
  children?: React.ReactNode
  session: Session
  library: Library
  libraryThreads: Chat[]
}

export function LibraryPage({
  threadId,
  userId,
  session,
  library,
  libraryThreads
}: LibraryPageProps) {
  if (!library) {
    notFound()
  }
  const [_, setNewChatId] = useLocalStorage('newChatId', threadId)
  const path = usePathname()

  const [messages] = useUIState()
  const [aiState] = useAIState()

  React.useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${threadId}`)
      }
    }
  }, [threadId, path, session?.user, messages])

  React.useEffect(() => {
    setNewChatId(threadId)
  })

  return (
    <div className={'p-5'}>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
            Library - {library.name}
          </h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0"></div>
      </div>
      <div className="py-5 w-1/2">
        <LibraryChat session={session} />
      </div>
      <div className="pt-5">
        <h2 className="text-xl font-bold">Threads</h2>
        {libraryThreads.length ? (
          <ul role="list" className="divide-y">
            {libraryThreads
              .filter(thread => thread)
              .map(thread => (
                <li key={`thread-${thread.id}`}>
                  <Link
                    href={thread.path}
                    className="flex justify-between gap-x-6 py-5"
                  >
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <p className="text-sm font-semibold leading-6">
                          {thread.title}
                        </p>
                        {/* <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                        thread messages
                      </p> */}
                      </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        3h ago
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        ) : (
          <>No threads in this library</>
        )}
      </div>
    </div>
  )
}

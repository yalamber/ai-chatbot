import * as React from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

import { AI } from '@/lib/chat/actions'
import { LibraryChat } from '@/components/library-chat'
import { Library } from '@/lib/types'
import { getLibrary } from '@/app/actions'

interface LibraryPageProps {
  id: string
  userId: string
  children?: React.ReactNode
}

const loadLibrary = React.cache(async (libraryId: string, userId: string) => {
  return await getLibrary(libraryId, userId)
})

export async function LibraryPage({ id, userId }: LibraryPageProps) {
  const library: Library | null = await loadLibrary(id, userId)
  if (!library) {
    notFound()
  }
  // TODO: fetch threads in this library

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <div className={'p-5'}>
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Library - {library.name}
            </h2>
          </div>
          <div className="mt-5 flex lg:ml-4 lg:mt-0"></div>
        </div>
        <div className="pt-5">
          <LibraryChat />
        </div>
        <div className="pt-5">
          <h2 className="text-xl font-bold text-gray-900">Threads</h2>
          <ul role="list" className="divide-y divide-gray-100">
            <li className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    thread name
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    thread messages
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last updated <time datetime="2023-01-23T13:23Z">3h ago</time>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </AI>
  )
}

import * as React from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

import { getLibraries, getChats } from '@/app/actions'
import { LibraryCreateButton } from '@/components/library-create-button'
import { ThreadItems } from '@/components/libraries-thread-list'

interface LibraryPageProps {
  userId?: string
  children?: React.ReactNode
}

const loadLibraries = React.cache(async (userId?: string) => {
  return await getLibraries(userId)
})

const loadThreads = React.cache(async (userId?: string) => {
  return await getChats(userId)
})

export async function Libraries({ userId }: LibraryPageProps) {
  const libraries = await loadLibraries(userId)
  const threads = await loadThreads(userId)

  return (
    <div className={'p-5'}>
      <div className="flex">
        <div className="w-2/3 p-5">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl border-b">
            Threads
          </h2>
          <div>
            <React.Suspense
              fallback={
                <div className="flex flex-col flex-1 px-4 space-y-4 overflow-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
                    />
                  ))}
                </div>
              }
            >
              <ThreadItems threads={threads} />
            </React.Suspense>
          </div>
        </div>
        <div className="w-1/3 p-5">
          <div className="lg:flex lg:items-center lg:justify-between  border-b">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Library
              </h1>
            </div>
            <div className="mt-5 flex lg:ml-4 lg:mt-0">
              <LibraryCreateButton />
            </div>
          </div>
          <ul role="list">
            {libraries.map(lib => (
              <li
                key={`library-${lib.id}`}
                className="mt-4 divide-y divide-gray-200 rounded-lg bg-white shadow"
              >
                <Link href={`/library/${lib.id}`}>
                  <div className="flex w-full items-center justify-between space-x-6 p-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-sm font-medium text-gray-900">
                          {lib.name}
                        </h3>
                        <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-inset ring-green-600/20">
                          {lib.threadCount}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {lib.createdAt}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

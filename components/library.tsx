import * as React from 'react'
import { getLibraries } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { LibraryCreateButton } from '@/components/library-create-button'

interface LibraryPageProps {
  userId?: string
  children?: React.ReactNode
}

const loadLibraries = React.cache(async (userId?: string) => {
  return await getLibraries(userId)
})

export async function Library({ userId }: LibraryPageProps) {
  const libraries = await loadLibraries(userId)

  return (
    <div className={'p-5'}>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Library
          </h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <LibraryCreateButton />
        </div>
      </div>
      <div className="pt-5">
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {libraries.map(lib => (
            <li
              key={`library-${lib.id}`}
              className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
            >
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

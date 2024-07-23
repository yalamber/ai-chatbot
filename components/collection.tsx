import * as React from 'react'
import { getLibraries } from '@/app/actions'
import { CollectionCreateButton } from './collection-create-button'
import { TrashIcon, EyeOpenIcon } from '@radix-ui/react-icons'

interface CollectionPageProps {
  userId?: string
  children?: React.ReactNode
}

const loadLibraries = React.cache(async (userId?: string) => {
  return await getLibraries(userId)
})

export async function Collection({ userId }: CollectionPageProps) {
  const libraries = await loadLibraries(userId)

  return (
    <div className={'p-5'}>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Collection
          </h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <CollectionCreateButton />
        </div>
      </div>
      <div className="pt-5">
        <table className="border border-zinc-800 w-full">
          <thead>
            <tr>
              <th className="px-4 text-left py-2 border-b">Name</th>
              <th className="px-4 text-left py-2 border-b">Link</th>
              <th className="px-4 text-left py-2 border-b">Document</th>
              <th className="px-4 text-left py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2  border-b">Test Name</td>
              <td className="px-4 py-2  border-b">Test Link</td>
              <td className="px-4 py-2  border-b">Test Document</td>
              <td className="px-4 py-2  border-b gap-4">
                <div className="flex gap-3">
                  <div title="View"><EyeOpenIcon  className="size-5 cursor-pointer" /></div>
                  <div title="Delete"><TrashIcon color='red'  className="size-5 cursor-pointer" /></div>
                </div>
              </td>
            </tr>
            {/* <tr>
              <td colSpan={4} className="px-4 py-2 text-center border-b">No Collection</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import * as React from 'react'
import moment from 'moment'
import { getCollections } from '@/app/actions'
import { CollectionCreateButton } from './collection-create-button'
import DeleteCollection from './delete-collection'
import { TrashIcon, EyeOpenIcon } from '@radix-ui/react-icons'

interface CollectionPageProps {
  userId?: string
  children?: React.ReactNode
}

const loadCollections = React.cache(async (userId?: string) => {
  return await getCollections(userId)
})

export async function Collection({ userId }: CollectionPageProps) {
  const collections = await loadCollections(userId)
  console.log("collections", collections)
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
              <th className="px-4 text-left py-2 border-b">Date Created</th>
              <th className="px-4 text-left py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections?.length > 0 &&
              collections.map(collection => {
                if(!collection) return null;
                const parsedDate = moment(
                  collection?.createdAt,
                  'ddd MMM DD YYYY HH:mm:ss ZZ'
                )
                const createdDate = parsedDate.format('DD-MM-YYYY, hh:mm:ss')
                return (
                  <tr key={collection?.id}>
                    <td className="px-4 py-2  border-b">{collection?.name}</td>
                    <td className="px-4 py-2  border-b">
                      {collection?.linkToCollection}
                    </td>
                    <td className="px-4 py-2  border-b">Document</td>
                    <td className="px-4 py-2  border-b">{createdDate}</td>
                    <td className="px-4 py-2  border-b gap-4">
                      <div className="flex gap-3">
                        {/* <div title="View">
                          <EyeOpenIcon className="size-5 cursor-pointer" />
                        </div> */}
                        <DeleteCollection id={collection?.id}/>
                      </div>
                    </td>
                  </tr>
                )
              })}
            {collections?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center border-b">
                  No Collection
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

"use client"

import { TrashIcon } from '@radix-ui/react-icons'
import { deleteCollection } from '@/app/(chat)/collections/actions'

export default function DeleteCollection({ id }: { id: string}) {
    const handleClick = (id: string) => {
        deleteCollection(id)
      }
  return (
    <div title="Delete" onClick={() => handleClick(id)}>
    <TrashIcon
      className="size-5 cursor-pointer"
    />
  </div>
  )
}

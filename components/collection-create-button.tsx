'use client'

import * as React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { addLibrary } from '@/app/(chat)/library/actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { getMessageFromCode } from '@/lib/utils'
import { IconSpinner } from '@/components/ui/icons'

export function CollectionCreateButton() {
  const [libraryCreateDialogOpen, setLibraryCreateDialogOpen] =
    React.useState(false)
  const router = useRouter()
  const [result, dispatch] = useFormState(addLibrary, undefined)

  React.useEffect(() => {
    if (result) {
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode))
      } else {
        toast.success(getMessageFromCode(result.resultCode))
        setLibraryCreateDialogOpen(false)
        router.refresh()
      }
    }
  }, [result, router])

  return (
    <>
      <Button onClick={() => setLibraryCreateDialogOpen(true)}>Create</Button>
      <Dialog
        open={libraryCreateDialogOpen}
        onOpenChange={setLibraryCreateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>Let&prime;s create collection</DialogDescription>
          </DialogHeader>
          <h2>Info</h2>
          <form action={dispatch}>
            <input
              className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              id="name"
              type="text"
              name="name"
              placeholder="Name"
              required
            />
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-zinc-800" />
            <input
              className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              id="name"
              type="text"
              name="name"
              placeholder="Link to collection"
              required
            />
            <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-zinc-800" />
            <div className="col-span-full">
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <svg
                    className="mx-auto size-12 text-gray-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-semibold text-white focus-within:outline-none  hover:text-gray-200">
                      <span>Upload Document</span>
                      <input
                        id="document"
                        name="document"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="items-center">
              <CreateButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CreateButton() {
  const { pending } = useFormStatus()

  return (
    <button
      className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      aria-disabled={pending}
    >
      {pending ? <IconSpinner /> : 'Create'}
    </button>
  )
}

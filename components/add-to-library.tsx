'use client'

import * as React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { addChatToLibrary } from '@/app/actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { getMessageFromCode } from '@/lib/utils'
import { IconSpinner } from '@/components/ui/icons'

export function AddToLibraryButton({
  libraries,
  chatId,
  selectedLibrary
}: {
  libraries: Array<any>
  chatId: string
  selectedLibrary?: string
}) {
  const [libraryCreateDialogOpen, setLibraryCreateDialogOpen] =
    React.useState(false)
  const router = useRouter()
  const [result, dispatch] = useFormState(addChatToLibrary, undefined)

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
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setLibraryCreateDialogOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          fill="currentColor"
          width={15}
          height={15}
        >
          <path d="M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8Z" />
        </svg>
      </Button>
      <Dialog
        open={libraryCreateDialogOpen}
        onOpenChange={setLibraryCreateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add To Library</DialogTitle>
          </DialogHeader>
          <form action={dispatch}>
            <select
              id="libraryId"
              name="libraryId"
              required
              className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <option selected>Choose a Library</option>
              {libraries?.length > 0 &&
                libraries?.map((library, index) => {
                  return (
                    <option
                      selected={library.id === selectedLibrary}
                      key={`library-${index}`}
                      value={library.id}
                    >
                      {library.name}
                    </option>
                  )
                })}
            </select>
            <input type="hidden" name="chatId" value={chatId} />
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
      {pending ? <IconSpinner /> : 'Add'}
    </button>
  )
}

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

export function AddToLibraryButton({ libraries, chatId }: {libraries: Array<any>, chatId: string}) {
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
          fill="none"
          version="1.1"
          id="Capa_1"
          width="20px"
          height="20px"
          viewBox="0 0 30.75 30.75"
          stroke="currentColor"
        >
          <g>
            <path
              d="M29.25,4.349H1.5c-0.829,0-1.5,0.672-1.5,1.5v19.053c0,0.828,0.671,1.5,1.5,1.5h27.75c0.829,0,1.5-0.672,1.5-1.5V5.849
		C30.75,5.021,30.079,4.349,29.25,4.349z M27.75,23.398H3V7.347h24.75V23.398z M6.375,15.375c0-1.242,1.007-2.25,2.25-2.25
		s2.25,1.008,2.25,2.25c0,1.242-1.007,2.25-2.25,2.25S6.375,16.616,6.375,15.375z M13.125,15.375c0-1.242,1.007-2.25,2.25-2.25
		c1.242,0,2.25,1.008,2.25,2.25c0,1.242-1.008,2.25-2.25,2.25C14.132,17.624,13.125,16.616,13.125,15.375z M19.875,15.375
		c0-1.242,1.007-2.25,2.25-2.25c1.242,0,2.25,1.008,2.25,2.25c0,1.242-1.008,2.25-2.25,2.25
		C20.882,17.624,19.875,16.616,19.875,15.375z"
            />
          </g>
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
              {libraries?.length > 0 && libraries?.map((library, index) => {
                return (
                  <option key={`library-${index}`} value={library.id}>{library.name}</option>
                )
              })}
            </select>
            <input type='hidden' name='chatId' value={chatId} />
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

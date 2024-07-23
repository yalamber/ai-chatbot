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

export function LibraryCreateButton() {
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
        setLibraryCreateDialogOpen(false);
        router.refresh();
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
            <DialogTitle>Create Library</DialogTitle>
            <DialogDescription>
              Let&prime;s create library to collect threads
            </DialogDescription>
          </DialogHeader>
          <form action={dispatch}>
            <input
              className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              id="name"
              type="text"
              name="name"
              placeholder="Enter library name"
              required
            />
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

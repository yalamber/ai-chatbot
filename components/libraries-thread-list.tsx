'use client'
import * as React from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Chat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { IconEllipsis, IconSpinner } from '@/components/ui/icons'
import { AddToLibraryButton } from './add-to-library'
import { removeChat } from '@/app/actions'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DropdownMenuItemIndicator } from '@radix-ui/react-dropdown-menu'
interface ThreadItemsProps {
  threads?: Chat[]
  libraries?: Array<any>
}

export function ThreadItems({ threads, libraries }: ThreadItemsProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()
  if (!threads?.length) return null
  return (
    <AnimatePresence>
      <ul role="list" className="divide-y">
        {threads.map(
          (thread, index) =>
            thread && (
              <motion.div
                key={thread?.id}
                exit={{
                  opacity: 0,
                  height: 0
                }}
              >
                <li>
                  <div className="flex justify-between gap-x-6 py-5">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <Link href={thread.path}>
                          <p className="text-sm font-semibold leading-6">
                            {thread.title}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5">
                            <p className="mt-1 text-xs leading-5">3h ago</p>
                          </p>
                        </Link>
                      </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <div className="flex">
                        {libraries &&
                          libraries?.length > 0 &&
                          !thread.libraryName && (
                            <Button variant="ghost">
                              <AddToLibraryButton
                                chatId={thread.id}
                                libraries={libraries}
                                selectedLibrary={thread.libraryId}
                              />
                            </Button>
                          )}
                        {thread.libraryName && (
                          <>
                            <span className="bg-gray-100 inline-flex items-center text-gray-800 text-xs font-medium me-2 px-2 py-0.5 rounded dark:bg-gray-800 dark:text-gray-200">
                              {thread.libraryName}
                            </span>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                              <IconEllipsis />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            sideOffset={8}
                            align="start"
                            className="w-fit"
                          >
                            <DropdownMenuItem className="flex-col items-start">
                              Add to collection
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                             onClick={() => setDeleteDialogOpen(true)}
                             className="flex-col items-start">
                              Delete Thread
                            </DropdownMenuItem>
                            {/* <DropdownMenuItemIndicator
                              onClick={() => setDeleteDialogOpen(true)}
                              className="flex-col items-start"
                            >
                              Delete Thread
                            </DropdownMenuItemIndicator> */}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </li>
                <AlertDialog
                  open={deleteDialogOpen}
                  onOpenChange={setDeleteDialogOpen}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your chat message and
                        remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isRemovePending}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isRemovePending}
                        onClick={event => {
                          event.preventDefault()
                          // @ts-ignore
                          startRemoveTransition(async () => {
                            const result = await removeChat({
                              id: thread.id,
                              path: thread.path
                            })

                            if (result && 'error' in result) {
                              toast.error(result.error)
                              return
                            }

                            setDeleteDialogOpen(false)
                            router.refresh()
                            router.push('/library')
                            toast.success('Chat deleted')
                          })
                        }}
                      >
                        {isRemovePending && (
                          <IconSpinner className="mr-2 animate-spin" />
                        )}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            )
        )}
      </ul>
    </AnimatePresence>
  )
}

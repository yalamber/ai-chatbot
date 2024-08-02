'use client'
import Link from 'next/link'
import { Chat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { IconPlus, IconTrash } from '@/components/ui/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
interface ThreadItemsProps {
  threads?: Chat[]
}

export function ThreadItems({ threads }: ThreadItemsProps) {
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
                          <p className="mt-1 truncate text-xs leading-5"></p>
                        </Link>
                      </div>
                    </div>
                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                      <p className="mt-1 text-xs leading-5">3h ago</p>
                      <div className="flex">
                        <Button variant="ghost">
                          <IconPlus />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost">...</Button>
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
                            <DropdownMenuItem className="flex-col items-start">
                              Delete Thread
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </li>
              </motion.div>
            )
        )}
      </ul>
    </AnimatePresence>
  )
}

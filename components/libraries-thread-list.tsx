'use client'
import Link from 'next/link'
import { Chat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

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
                  <Link href={thread.path}>
                    <div className="flex justify-between gap-x-6 py-5">
                      <div className="flex min-w-0 gap-x-4">
                        <div className="min-w-0 flex-auto">
                          <p className="text-sm font-semibold leading-6">
                            {thread.title}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5"></p>
                        </div>
                      </div>
                      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                        <p className="mt-1 text-xs leading-5">
                          <time datetime="2023-01-23T13:23Z">3h ago</time>
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              </motion.div>
            )
        )}
      </ul>
    </AnimatePresence>
  )
}

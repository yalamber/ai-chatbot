import { Sidebar } from '@/components/sidebar'
import Link from 'next/link'

import { auth } from '@/auth'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { IconPlus } from '@/components/ui/icons'
import { ChatHistory } from '@/components/chat-history'

export async function SidebarDesktop() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
      <div className="flex flex-col h-full">
        <div>
          <div className="mb-2 px-2 pt-2">
            <Button className="w-full">
              Threads &nbsp; &nbsp;
              <IconPlus className="-translate-x-2 stroke-2" />
            </Button>
          </div>
          <div className="mb-2 px-2 pt-2">
            <Link
              href="/library"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
              )}
            >
              Library
            </Link>
          </div>
          <ChatHistory userId={session.user.id} />
          <div className="mb-2 px-2 pt-2">
            <Link
              href="/collections"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10'
              )}
            >
              # Collections
            </Link>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}

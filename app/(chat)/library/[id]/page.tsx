import * as React from 'react'
import { notFound, redirect } from 'next/navigation'

import { AI } from '@/lib/chat/actions'
import { nanoid } from '@/lib/utils'
import { auth } from '@/auth'
import { getLibrary, getLibraryThreads } from '@/app/actions'
import { Session } from '@/lib/types'
import { LibraryPage } from '@/components/library'

export interface LibraryPageProps {
  params: {
    id: string
  }
}

export const metadata = {
  title: 'CognitiveView - Library'
}

const loadLibrary = React.cache(async (libraryId: string, userId: string) => {
  return await getLibrary(libraryId, userId)
})

const loadLibraryThreads = React.cache(async (libraryId: string) => {
  return await getLibraryThreads(libraryId)
})

export default async function Library({ params }: LibraryPageProps) {
  const id = nanoid()
  const session = (await auth()) as Session
  if (!session?.user) {
    redirect(`/login?next=/library`)
  }
  const userId = session.user.id as string
  const library = await getLibrary(params.id, userId)
  const libraryThreads = await getLibraryThreads(params.id)

  if (!library) {
    return redirect('/')
  }

  if (library?.userId !== session?.user?.id) {
    notFound()
  }

  return (
    <AI initialAIState={{ libraryId: params.id, chatId: id, messages: [] }}>
      <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
        <LibraryPage
          threadId={id}
          userId={userId}
          session={session}
          library={library}
          libraryThreads={libraryThreads}
        />
      </div>
    </AI>
  )
}

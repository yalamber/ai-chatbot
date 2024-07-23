import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getLibrary } from '@/app/actions'
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

export default async function Library({ params }: LibraryPageProps) {
  const session = (await auth()) as Session
  if (!session?.user) {
    redirect(`/login?next=/library`)
  }
  const userId = session.user.id as string
  const library = await getLibrary(params.id, userId)

  if (!library) {
    redirect('/')
  }

  if (library?.userId !== session?.user?.id) {
    notFound()
  }

  return (
    <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <LibraryPage id={params.id} userId={userId} />
    </div>
  )
}

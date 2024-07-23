import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Session } from '@/lib/types'

export const metadata = {
  title: 'CognitiveView - Library'
}

export interface LibrarySinglePageProps {
  params: {
    id: string
  }
}


export default async function IndexPage({ params }: LibrarySinglePageProps) {
  const session = (await auth()) as Session
  if (!session?.user) {
    redirect(`/login?next=/library/${params.id}`)
  }
  const userId = session.user.id as string;
  // TODO: get single library
  
  return (
    <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      Here
    </div>
  )
}

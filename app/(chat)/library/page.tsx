import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { Libraries } from '@/components/libraries'

export const metadata = {
  title: 'CognitiveView - Library'
}

export default async function IndexPage() {
  const session = (await auth()) as Session
  if (!session?.user) {
    redirect(`/login?next=/library`)
  }
  const userId = session.user.id as string

  return (
    <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <Libraries userId={userId} />
    </div>
  )
}

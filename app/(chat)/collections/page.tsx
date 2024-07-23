import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { Collection } from '@/components/collection'

export const metadata = {
  title: 'CognitiveView - Collections'
}

export default async function IndexPage() {
  const session = (await auth()) as Session
  if (!session?.user) {
    redirect(`/login?next=/collections`)
  }
  const userId = session.user.id as string

  return (
    <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <Collection userId={userId}/>
    </div>
  )
}

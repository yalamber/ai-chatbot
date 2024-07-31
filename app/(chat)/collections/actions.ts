'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'
import { saveCollection } from '@/app/actions'
import { ResultCode } from '@/lib/utils'
import { auth } from '@/auth'
import { Collection } from '@/lib/types'

interface Result {
  type: string
  resultCode: ResultCode
}

export async function getCollection(userId: string, id: string) {
  const collection = await kv.hgetall<Collection>(`collection:${id}`)
  if (!collection || (userId && collection.userId !== userId)) {
    return null
  }
  return collection
}

export async function addCollection(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const session = await auth()
    if (!session?.user) {
      return {
        type: 'error',
        resultCode: ResultCode.NotAuthenticated
      }
    }
    const name = formData.get('name')
    const linkToCollection = formData.get('linkToCollection')

    const parsedData = z
      .object({
        name: z.string().min(3),
        linkToCollection: z.string()
      })
      .safeParse({
        name,
        linkToCollection
      })

    if (parsedData.success) {
      const collection: Collection = {
        id: crypto.randomUUID(),
        name: parsedData.data.name,
        userId: session.user.id,
        createdAt: new Date().toString(),
        linkToCollection: parsedData.data.linkToCollection
      }
      await saveCollection(collection)
      return {
        type: 'success',
        resultCode: ResultCode.CollectionCreated
      }
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.UnknownError
      }
    }
  } catch (error) {
    return {
      type: 'error',
      resultCode: ResultCode.UnknownError
    }
  }
}

export async function deleteCollection(
  id: string
) {
  const session = await auth()
  if (!session?.user) {
    return {
      type: 'error',
      resultCode: ResultCode.NotAuthenticated
    }
  }
  const userId = session.user.id as string

  if (!id) {
    return {
      type: 'error',
      resultCode: ResultCode.InvalidSubmission
    }
  }

  const collection = await getCollection(userId, id)

  if (!collection) {
    return {
      type: 'error',
      resultCode: ResultCode.NoCollection
    }
  }

  await kv.del(`collection:${id}`)
  await kv.zrem(`user:collection:${session.user.id}`, `collection:${id}`)

  revalidatePath('/collections')
  return redirect('/collections')
}

'use server'

import { ResultCode } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { kv } from '@vercel/kv'

import { auth } from '@/auth'
import { type Chat, type Library, type Collection } from '@/lib/types'

export async function getLibraries(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const libraries: string[] = await kv.zrange(
      `user:library:${userId}`,
      0,
      -1,
      {
        rev: true
      }
    )

    for (const library of libraries) {
      pipeline.hgetall(library)
    }

    const results = await pipeline.exec()

    return results as Library[]
  } catch (error) {
    return []
  }
}

export async function saveLibrary(library: Library) {
  const session = await auth()

  if (session && session.user) {
    const pipeline = kv.pipeline()
    pipeline.hmset(`library:${library.id}`, library)
    pipeline.zadd(`user:library:${library.userId}`, {
      score: Date.now(),
      member: `library:${library.id}`
    })
    await pipeline.exec()
  } else {
    return
  }
}

export async function getLibrary(id: string, userId: string) {
  const library = await kv.hgetall<Library>(`library:${id}`)

  if (!library || (userId && library.userId !== userId)) {
    return null
  }

  return library
}

export async function getLibraryThreads(libraryId: string) {
  if (!libraryId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const threads: string[] = await kv.zrange(
      `library:threads:${libraryId}`,
      0,
      -1,
      {
        rev: true
      }
    )

    for (const thread of threads) {
      pipeline.hgetall(thread)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const chats: string[] = await kv.zrange(`user:chat:${userId}`, 0, -1, {
      rev: true
    })

    for (const chat of chats) {
      pipeline.hgetall(chat)
    }

    const results = await pipeline.exec()

    return results as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  //Convert uid to string for consistent comparison with session.user.id
  const uid = String(await kv.hget(`chat:${id}`, 'userId'))

  if (uid !== session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  await kv.del(`chat:${id}`)
  await kv.zrem(`user:chat:${session.user.id}`, `chat:${id}`)

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats: string[] = await kv.zrange(`user:chat:${session.user.id}`, 0, -1)
  if (!chats.length) {
    return redirect('/')
  }
  const pipeline = kv.pipeline()

  for (const chat of chats) {
    pipeline.del(chat)
    pipeline.zrem(`user:chat:${session.user.id}`, chat)
  }

  await pipeline.exec()

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(id: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      error: 'Unauthorized'
    }
  }

  const chat = await kv.hgetall<Chat>(`chat:${id}`)

  if (!chat || chat.userId !== session.user.id) {
    return {
      error: 'Something went wrong'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await kv.hmset(`chat:${chat.id}`, payload)

  return payload
}

export async function saveChat(chat: Chat, libraryId?: string) {
  const session = await auth()

  if (session && session.user) {
    const pipeline = kv.pipeline()
    pipeline.hmset(`chat:${chat.id}`, chat)
    pipeline.zadd(`user:chat:${chat.userId}`, {
      score: Date.now(),
      member: `chat:${chat.id}`
    })
    if (libraryId) {
      pipeline.zadd(`library:threads:${libraryId}`, {
        score: Date.now(),
        member: `chat:${chat.id}`
      })
    }
    await pipeline.exec()
  } else {
    return
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

interface Result {
  type: string
  resultCode: ResultCode
}

export async function addChatToLibrary(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  const session = await auth()
  if (!session?.user) {
    return {
      type: 'error',
      resultCode: ResultCode.NotAuthenticated
    }
  }
  const pipeline = kv.pipeline()
  const libraryId = formData.get('libraryId')
  const chatId = formData.get('chatId')
  if(!libraryId || !chatId) {
    return {
      type: 'error',
      resultCode: ResultCode.InvalidSubmission
    }
  }
  pipeline.zadd(`library:threads:${libraryId}`, {
    score: Date.now(),
    member: `chat:${chatId}`
  })
  await pipeline.exec()
  return {
    type: 'success',
    resultCode: ResultCode.ChatAddedToLibrary
  }
}

export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}

export async function getCollections(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const pipeline = kv.pipeline()
    const collections: string[] = await kv.zrange(
      `user:collection:${userId}`,
      0,
      -1,
      {
        rev: true
      }
    )

    for (const collection of collections) {
      pipeline.hgetall(collection)
    }

    const results = await pipeline.exec()

    return results as Library[]
  } catch (error) {
    return []
  }
}

export async function saveCollection(collection: Collection) {
  const session = await auth()
  if (session && session.user) {
    const pipeline = kv.pipeline()
    pipeline.hmset(`collection:${collection.id}`, collection)
    pipeline.zadd(`user:collection:${collection.userId}`, {
      score: Date.now(),
      member: `collection:${collection.id}`
    })
    await pipeline.exec()
  } else {
    return
  }
}

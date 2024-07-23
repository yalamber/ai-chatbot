'use server'
import { z } from 'zod'
import { saveLibrary } from '@/app/actions'
import { ResultCode } from '@/lib/utils'
import { auth } from '@/auth'
import { Library } from '@/lib/types'

interface Result {
  type: string
  resultCode: ResultCode
}

export async function addLibrary(
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

    const parsedData = z
      .object({
        name: z.string().min(3)
      })
      .safeParse({
        name
      })

    if (parsedData.success) {
      const library: Library = {
        id: crypto.randomUUID(),
        name: parsedData.data.name,
        userId: session.user.id,
        createdAt: new Date().toString(),
        threadCount: 0
      }
      await saveLibrary(library)
      return {
        type: 'success',
        resultCode: ResultCode.LibraryCreated
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

'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import Textarea from 'react-textarea-autosize'
import { useActions, useUIState, useAIState } from 'ai/rsc'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Session } from '@/lib/types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'

interface LibraryChatProps {
  session: Session
}

export function LibraryChat({ session }: LibraryChatProps) {
  const id = nanoid()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { formRef, onKeyDown } = useEnterSubmit()
  const [input, setInput] = useState('')
  const router = useRouter()
  const { submitUserMessage } = useActions()

  return (
    <>
      <form
        ref={formRef}
        onSubmit={async (e: any) => {
          e.preventDefault()
          
        }}
      >
        <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background sm:rounded-md sm:border">
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            placeholder="Start new thread."
            className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            name="message"
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <div className="absolute right-0 top-[13px] sm:right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" size="icon" disabled={input === ''}>
                  <IconArrowElbow />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </form>
    </>
  )
}

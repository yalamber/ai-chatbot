'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import Textarea from 'react-textarea-autosize'
import { usePathname, useRouter } from 'next/navigation'
import { useActions, useUIState, useAIState } from 'ai/rsc'

import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { ChatList } from '@/components/chat-list'
import { UserMessage } from './stocks/message'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import { EmptyScreen } from '@/components/empty-screen'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import type { AI } from '@/lib/chat/actions'

export interface LibraryChatProps extends React.ComponentProps<'div'> {
  id?: string
  session: Session
}

export function LibraryChat({ className, session }: LibraryChatProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { formRef, onKeyDown } = useEnterSubmit()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [aiState] = useAIState()
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [aiState.messages, router])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <>
      <div
        className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
        ref={scrollRef}
      >
        <form
          ref={formRef}
          onSubmit={async (e: any) => {
            e.preventDefault()
            setMessages(currentMessages => [
              ...currentMessages,
              {
                id: nanoid(),
                display: <UserMessage>{input}</UserMessage>
              }
            ])

            const responseMessage = await submitUserMessage(input)
            setMessages(currentMessages => [
              ...currentMessages,
              responseMessage
            ])
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
        <div className={cn('pt-4 md:pt-10', className)} ref={messagesRef}>
          {messages.length > 0 && (
            <ChatList messages={messages} isShared={false} session={session} />
          )}
          <div className="w-full h-px" ref={visibilityRef} />
        </div>
      </div>
    </>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { useUIState, useAIState } from 'ai/rsc'

import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { ChatPanel } from '@/components/chat-panel'

interface LibraryChatProps {
  libraryId: string
}

export function LibraryChat({ libraryId }: LibraryChatProps) {
  const id = nanoid()
  const [input, setInput] = useState('')
  const [messages] = useUIState()
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <ChatPanel
      id={id}
      input={input}
      setInput={setInput}
      isAtBottom={isAtBottom}
      scrollToBottom={scrollToBottom}
    />
  )
}

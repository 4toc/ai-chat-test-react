import { ChatSidebar } from "@/components/ChatSidebar.tsx";
import { ChatMessages } from "@/components/ChatMessages.tsx";
import {useEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks";
import {fetchChatPreviewList} from "@/store";
import {cn} from "@/lib/utils.ts";

export const ChatPage = () => {
  const dispatch = useAppDispatch()
  const isInitialized = useRef(false)
  const selectedChatId = useAppSelector(state => state.chat.selectedChatId)

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    dispatch(fetchChatPreviewList())
  }, [dispatch])

  return (
    <div className={'flex h-full justify-center w-full'}>
      <div className={'max-w-[980px] w-full flex py-4 justify-center'}>
        <div className={cn('md:flex max-w-[320px] w-full', selectedChatId ? 'hidden' : '')}>
          <ChatSidebar/>
        </div>

        <div className={cn('w-full ml-8 md:block',
          selectedChatId ? '' : 'hidden')}>
          <ChatMessages/>
        </div>
      </div>
    </div>
  )
}
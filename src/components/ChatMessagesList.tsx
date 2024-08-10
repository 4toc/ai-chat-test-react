import ChatMessagesItem from "@/components/ChatMessagesItem.tsx";
import Loader from "@/components/ui/loader.tsx";
import {useLayoutEffect, useRef} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks";

const ChatMessagesList = () => {
  const dispatch = useAppDispatch()
  const selectedChatId = useAppSelector(state => state.chat.selectedChatId)
  const messages = useAppSelector(state => state.chat.messages)
  const messagesListRef = useRef<HTMLDivElement | null>(null);
  const isMessageSending = useAppSelector(state => state.chat.isMessageSending)
  const prevMessagesLengthRef = useRef(0);
  const isMessagesLoading = useAppSelector(state => state.chat.isMessagesLoading)

  useLayoutEffect(() => {
    if (prevMessagesLengthRef.current === 0 && messages.length > 0) {
      messagesListRef.current?.scrollIntoView({ behavior: "instant" })
    } else {
      messagesListRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    prevMessagesLengthRef.current = messages.length
  }, [messages])

  return (
    <div className={'flex flex-col w-full gap-3 h-full'}>
      {selectedChatId ? (
          <>
            {messages.map(message => (
              <ChatMessagesItem key={message.id} message={message}/>
            ))}
            {isMessageSending || isMessagesLoading && (
              <div>
                <Loader/>
              </div>
            )}
          </>
      ) : (
        <div className={'text-zinc-600 flex items-center justify-center h-full'}>Select a Chat</div>
      )}

      <div ref={messagesListRef}></div>
    </div>
  )
}

export default ChatMessagesList
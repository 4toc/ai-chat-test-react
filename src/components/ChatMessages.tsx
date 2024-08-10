import {Input} from "@/components/ui/input.tsx";
import {useEffect, useState, useRef} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks";
import {sendChatMessage, updatePreviewLastMessage, pushMessage, selectChatId} from "@/store";
import ChatMessagesList from "@/components/ChatMessagesList.tsx";
import {ChevronLeft} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";

export const ChatMessages = () => {
  const [text, setText] = useState('')
  const dispatch = useAppDispatch()
  const selectedChatId = useAppSelector(state => state.chat.selectedChatId)

  const handleSave = () => {
    if (text.trim() === '') return

    dispatch(sendChatMessage({ text }))
    dispatch(pushMessage(text))
    dispatch(updatePreviewLastMessage({
      botId: selectedChatId,
      text: text
    }))
    setText('')
  }
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      handleSave()
    }
  }

  return (
    <div className={'h-full flex flex-col box-border max-h-screen'}>
      <div className={'flex'}>
        <ChevronLeft
          className={cn('md:hidden mr-3', selectedChatId ? 'flex' : 'hidden')}
          onClick={() => dispatch(selectChatId(''))}
        />
        <h1>Messages</h1>
      </div>
      <div className={'flex-1 overflow-y-auto pr-4'}>
        <ChatMessagesList />
      </div>
      {selectedChatId && (
        <div className={'mt-4 flex'}>
          <Input placeholder={'Type a message'}
                 value={text}
                 onKeyUp={handleKeyUp}
                 onChange={e => setText(e.target.value)}/>
          <Button
            className={'ml-2'}
            onClick={() => {handleSave()}}>Send</Button>
        </div>
      )}
    </div>
  );
}
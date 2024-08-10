import {MessageType} from "@/types"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {cn} from "@/lib/utils.ts";
dayjs.extend(relativeTime)

const ChatMessagesItem = ({ message }: { message: MessageType }) => {
  return (
    <div
      className={cn('flex flex-col rounded-xl bg-zinc-100 p-3 max-w-[400px]',
      message.fromUser && 'ml-auto bg-blue-100')}>
      <div>{message.text}</div>
      <div className={'text-xs text-zinc-600 text-right'}>{dayjs(message.createdAt).fromNow()}</div>
    </div>
  )
}

export default ChatMessagesItem
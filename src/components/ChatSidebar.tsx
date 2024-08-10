import {cn} from "@/lib/utils.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar.tsx";
import {useAppSelector, useAppDispatch} from "@/hooks";
import {fetchMessages, selectChatId, resetState} from "@/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)
import {useAuth} from "@/context/authContext.tsx";

export const ChatSidebar = () => {
  const selectedChatId = useAppSelector(state => state.chat.selectedChatId)
  const dispatch = useAppDispatch()
  const chatbotList = useAppSelector(state => state.chat.chatPreviewList)
  const { logOut } = useAuth()

  const formatDate = (date: string) => {
    return dayjs(date).fromNow()
  }

  const selectBot = (id: string) => {
    dispatch(selectChatId(id))
    dispatch(fetchMessages())
  }

  const handleLogout = () => {
    logOut()
    dispatch(resetState())
  }

  return (
    <div className="chat-sidebar w-full h-full flex flex-col px-2 md:px-0">
      <h2>Chats</h2>
      <div className={'flex flex-col gap-2'}>
        {chatbotList.map(item => (
            <button key={item.id} className={cn(
              "flex w-full gap-4 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              selectedChatId === item.id && "bg-muted"
            )}
            onClick={() => selectBot(item.id)}>
              <Avatar>
                <AvatarImage src={item.avatarUrl} alt={item.name} className={'object-cover'} />
                <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className={'w-full overflow-hidden '}>
                <div className={'flex items-center w-full'}>
                  <div className={'font-semibold'}>{item.name}</div>
                  {item.lastMessage && (
                    <div
                      className={'ml-auto text-xs text-muted-foreground'}>{formatDate(item.lastMessage?.createdAt)}</div>
                  )}
                </div>
                {item.lastMessage && (
                  <div className={'text-nowrap overflow-ellipsis overflow-hidden'}>
                    {item.lastMessage?.text}
                  </div>
                )}
              </div>
            </button>
          )
        )}
      </div>
      <div className={'mt-auto flex justify-center'}>
        <button className={'text-xs text-zinc-500'} onClick={() => handleLogout()}>Log Out</button>
      </div>
    </div>
  );
}
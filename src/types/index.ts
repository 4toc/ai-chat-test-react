export type BotChatPreviewType = {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessage?: {
    text: string
    createdAt: string
  }
}

export type MessageType = {
  id: string,
  botId: string,
  text: string,
  fromUser: boolean,
  createdAt: string,
}
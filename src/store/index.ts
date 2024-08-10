import { configureStore, createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import API from '@/lib/api.ts'
import {BotChatPreviewType, MessageType} from "@/types";

interface CounterState {
  selectedChatId: string
  chatPreviewList: BotChatPreviewType[]
  isChatPreviewListLoading: boolean
  messages: MessageType[],
  isMessagesLoading: boolean,
  isMessageSending: boolean,
}

const initialState: CounterState = {
  selectedChatId: '',
  chatPreviewList: [],
  isChatPreviewListLoading: false,
  messages: [],
  isMessagesLoading: false,
  isMessageSending: false,
}

export const fetchChatPreviewList = createAsyncThunk('chat/fetchChatPreviewList', async () => {
  const result = await API.get('/chat')
  return result.data
})

export const fetchMessages = createAsyncThunk('chat/fetchMessages', async (_, thunkAPI) => {
  const { getState } = thunkAPI
  const state = getState() as RootState
  const result = await API.get(`/chat/messages?botId=${state.chat.selectedChatId}`)
  return result.data
})

export const sendChatMessage = createAsyncThunk('chat/sendChatMessage', async (data: { text: string }, thunkAPI) => {
  const { getState } = thunkAPI
  const state = getState() as RootState
  const result = await API.post('/chat/messages', {
    text: data.text,
    botId: state.chat.selectedChatId,
  })
  return result.data
})

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    selectChatId: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload
      state.messages = []
    },
    pushMessage: (state, action: PayloadAction<string>) => {
      state.messages.push({
        id: Math.random().toString(),
        botId: state.selectedChatId,
        text: action.payload,
        fromUser: true,
        createdAt: new Date().toISOString(),
      })
    },
    updatePreviewLastMessage: (state, action: PayloadAction<{ botId: string, text: string }>) => {
      const bot = state.chatPreviewList.find(bot => bot.id === action.payload.botId)
      if (bot) {
        bot.lastMessage = {
          text: action.payload.text,
          createdAt: new Date().toISOString()
        }
      }
    },
    resetState: (state) => {
      state.selectedChatId = ''
      state.chatPreviewList = []
      state.isChatPreviewListLoading = false
      state.messages = []
      state.isMessagesLoading = false
      state.isMessageSending = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatPreviewList.pending, (state) => {
        state.isChatPreviewListLoading = true;
      })
      .addCase(fetchChatPreviewList.fulfilled, (state, action: PayloadAction<BotChatPreviewType[]>) => {
        state.isChatPreviewListLoading = false;
        state.chatPreviewList = action.payload;
      })
      .addCase(fetchChatPreviewList.rejected, (state) => {
        state.isChatPreviewListLoading = false;
      });

    builder.addCase(fetchMessages.pending, (state) => {
        state.isMessagesLoading = true;
      }).addCase(fetchMessages.fulfilled, (state, action: PayloadAction<MessageType[]>) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      }).addCase(fetchMessages.rejected, (state) => {
        state.isMessagesLoading = false;
      })

    builder.addCase(sendChatMessage.pending, (state) => {
        state.isMessageSending = true;
      }).addCase(sendChatMessage.fulfilled, (state, action: PayloadAction<MessageType>) => {
        state.isMessageSending = false;
        state.messages.push(action.payload)
        chatSlice.caseReducers.updatePreviewLastMessage(state, {
          type: 'updatePreviewLastMessage',
          payload: {
            botId: state.selectedChatId,
            text: action.payload.text
          }
        })
      }).addCase(sendChatMessage.rejected, (state) => {
        state.isMessageSending = false;
      })
  },
})

export const {
  selectChatId,
  pushMessage,
  updatePreviewLastMessage,
  resetState,
} = chatSlice.actions;

export const store = configureStore({
  reducer: {
    chat: chatSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
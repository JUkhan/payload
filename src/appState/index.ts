import { User } from '@/payload-types'
import { createState } from '@jukhan/nano-state'
import { ChatGroup, ChatMessage } from '@/payload-types'
export type AppState = {
  loggedInUser: User | null
  toggleWindow: boolean
  unreadMessage: number
  groups: ChatGroup[]
  users?: [{ value: string; label: string; email: string }]
  getMessages?: (groupId: string) => Promise<ChatMessage[]>
  createGroup?: (data: any) => Promise<[string | null, ChatGroup | null]>
}

export const { getState, setState, dispatch, useStateEffect, useSelector, select } =
  createState<AppState>({
    loggedInUser: null,
    toggleWindow:true,
    unreadMessage:2,
    groups:[]
  })

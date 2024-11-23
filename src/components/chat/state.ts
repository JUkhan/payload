import { User } from '@/payload-types'
import { createState } from '@jukhan/nano-state'
import { ChatGroup, ChatMessage } from '@/payload-types'

export type ChatState = {
  loggedInUser: User | null
  toggleWindow: boolean
  groups: ChatGroup[]
  unreadStatus:Record<string, number>
  selectedGroup:ChatGroup
  users?: [{ value: string; label: string; email: string }]
  getMessages?: (groupId: string) => Promise<ChatMessage[]>
  createGroup?: (data: any) => Promise<[string | null, ChatGroup | null]>
}

export const { getState, setState, dispatch, useStateEffect, useSelector, select } =
  createState<ChatState>({
    loggedInUser: null,
    toggleWindow:false,
    groups:[],
    unreadStatus:{},
    selectedGroup:{} as any
  })

const KEY='chat-unread-status'
export function getUnreadStatus():Record<string, number>{
    const localState=localStorage.getItem(KEY)||'{}'
    return JSON.parse(localState)
}

export function setUnreadStatus(groupName:string, value: number){
    const unreadStatus=select(s=>s.unreadStatus)
    unreadStatus[groupName]=value
    setState({unreadStatus})
    localStorage.setItem(KEY, JSON.stringify(unreadStatus))
}

export function saveToLocal(status:Record<string, number>){
  localStorage.setItem(KEY, JSON.stringify(status))
}
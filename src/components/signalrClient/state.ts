import { User } from '@/payload-types'
import { createState } from '@jukhan/nano-state'
import { ChatGroup, ChatMessage } from '@/payload-types'



const KEY='chat-unread-status'
export function getUnreadStatus():Record<string, number>{
    const localState=localStorage.getItem(KEY)||'{}'
    return JSON.parse(localState)
}
export function saveToLocal(status:Record<string, number>){
  localStorage.setItem(KEY, JSON.stringify(status))
}
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
//import { useUser, UserContextType } from "@/providers/user-provider";
import { Input } from '@/components/ui/input'
import { Plus, CirclePlus } from 'lucide-react'
import { cn } from '@/utilities/cn'
import MarkdownView from 'react-showdown'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { ScrollArea } from '@/components/ui/scroll-area'
//import { Separator } from '@/components/ui/separetor'
import GroupChatComponent from './group'
import { ChatGroup } from '@/payload-types'
import { KeyValuePair } from 'tailwindcss/types/config'
import { toast } from 'sonner'
import { setState, useSelector, select, getUnreadStatus, setUnreadStatus, getState } from './state'
import useWebSocketConnectionHook from './useWebSocketConnectionHook'
import { format, } from 'date-fns/format'
import {getTime} from 'date-fns/getTime'
import { Badge } from '@/components/ui/badge'

const ChatWindow = () => {
  const [msgObj, setMsgObj] = useState<KeyValuePair<string, any[]>>({})
  const { loggedInUser, toggleWindow, groups, getMessages, unreadStatus, selectedGroup, users } =
    useSelector((s) => s)

  const io = useWebSocketConnectionHook((listenningOn: string, data: any) => {
    switch (listenningOn) {
      case 'group':
        setMsgObj((pre) => {
          if (pre[data.groupName] && pre[data.groupName].length > 0) {
            const createdAt = pre[data.groupName][pre[data.groupName].length - 1].createdAt

            if (createdAt === data.createdAt) {
              return pre
            }
          }
          const newObj = Object.assign({}, pre)

          if (newObj[data.groupName]) {
            newObj[data.groupName] = [...newObj[data.groupName], data]
          } else {
            newObj[data.groupName] = [data]
          }
          console.log(newObj)
          return newObj
        })

        scrollToView()
        const { selectedGroup, unreadStatus } = getState()

        if (selectedGroup.groupName !== data.groupName) {
          const st = unreadStatus[data.groupName] || 0
          setUnreadStatus(data.groupName, st + 1)
          toast(data.groupName + ` -  ${data.userName}`, {
            description: data.message,
          })
        }
        break

      case 'join':
        setState((pre) => {
          if (!pre.groups?.find((it) => it.groupName === data.groupName)) {
            if (data.users.find((it: any) => it.userId === pre.loggedInUser?.email)) {
              const groups = select((state) => state.groups)
              groups.unshift(data)
              let sg = pre.selectedGroup
              if (data.creatorId === pre.loggedInUser?.email) {
                sg = data
              } else {
                io.current?.disconnect()
                io.current?.connect()
              }
              return { groups, selectedGroup: sg }
            }
          }
          return pre
        })
        break

      case 'email':
        console.log('Email sending to:')
        console.log(data)
    }
  })
  const [message, setMessage] = useState('')
  const [[width, height], setHeight] = useState([0,0])
  const [isPrivate, setPrivate] = useState(0)
  //const [selectedGroup, setSelectedGroup] = useState<ChatGroup>({} as any)
  const scrollElmRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    //setState({ unreadStatus: getUnreadStatus() })
    if (scrollElmRef.current) {
      scrollElmRef.current.scrollIntoView()
    }
    setHeight(s=>[inputRef.current?.clientWidth??700, window.innerHeight - 150])
    const handleSize = () => {
      setHeight((_) =>[inputRef.current?.clientWidth??700, window.innerHeight - 150])
    }
    window.addEventListener('resize', handleSize)
    console.log('activeuser', io, loggedInUser, users)
    if (loggedInUser) {
      console.log('---------', loggedInUser)
      io.current?.emit('activeUser', loggedInUser, users)
    }
    return () => window.removeEventListener('resize', handleSize)
  }, [loggedInUser, users, io])
  const scrollToView = (delay: number = 100) => {
    setTimeout(() => {
      if (scrollElmRef.current) {
        scrollElmRef.current.scrollTop = scrollElmRef.current.scrollHeight
      }
    }, delay)
  }
  const sendMessage = () => {
    io.current?.emit(selectedGroup.groupName === 'All Users' ? 'all' : 'group', {
      groupId: selectedGroup.id,
      groupName: selectedGroup.groupName,
      userName: `${loggedInUser?.name}`,
      groupUsers: selectedGroup.users,
      message,
    })
    setMessage('')
  }
  const userName = `${loggedInUser?.name}`
  const getPrivateName = (groupName: string) => {
    return groupName.replace(userName, '').replace(',', '')
  }
  //
  return (
    <TooltipProvider>
      <div style={{ height: toggleWindow ? height : 0 }} className="ml-2 mr-2 mb-2">
        <ResizablePanelGroup direction="horizontal" className="rounded border">
          <ResizablePanel defaultSize={25} className="bg-gray-50">
            <div className="h-12 border-b">
              <div className="flex items-center justify-between">
                <span className="font-semibold pt-3 pl-4">Chat</span>
                <div className="flex pt-2 pr-2">
                  <Tooltip>
                    <TooltipTrigger>
                      <CirclePlus
                        onClick={() => setPrivate(1)}
                        className="hover:text-red-400 cursor-pointer mr-2 w-4 h-4"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Private chat</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <Plus
                        onClick={() => setPrivate(2)}
                        className="hover:text-red-400 cursor-pointer w-4 h-4"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a group</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            <ScrollArea style={{ height: height - 120 }} className="">
              {groups?.map((group) => (
                <div
                  key={group.id}
                  onClick={async () => {
                    if (!msgObj[group.groupName] && getMessages) {
                      const data = await getMessages(group.id)
                      setMsgObj((pre) => ({ ...pre, [group.groupName]: data }))
                      scrollToView(500)
                      if (inputRef.current) inputRef.current.focus()
                    }
                    setState({ selectedGroup: group })
                    setUnreadStatus(group.groupName, 0)
                    scrollToView()
                  }}
                  className={cn('p-2 cursor-pointer pl-4 font-semibold hover:bg-purple-100', {
                    'bg-purple-200': group.id === selectedGroup.id,
                  })}
                >
                  <span>{group.isPrivate ? getPrivateName(group.groupName) : group.groupName}</span>
                  {unreadStatus[group.groupName] > 0 && (
                    <Badge className="ml-2" variant="destructive">
                      {unreadStatus[group.groupName]}
                    </Badge>
                  )}
                </div>
              ))}
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className="bg-white" defaultSize={75}>
            <div className="flex items-center pl-4 h-12 border-b">
              {isPrivate === 0 ? (
                <span>
                  {selectedGroup.isPrivate
                    ? getPrivateName(selectedGroup?.groupName)
                    : selectedGroup?.groupName}
                </span>
              ) : (
                <GroupChatComponent
                  isPrivate={isPrivate === 1}
                  setPrivate={setPrivate}
                  socket={io.current!}
                />
              )}
            </div>
           
            <ScrollArea
              ref={scrollElmRef}
              className="p-2 pb-8"
              style={{ height: height - 100 }}
            >
              <div className="flex flex-col items-center">
                <div style={{width:width+60}}>
                  {msgObj[selectedGroup.groupName]?.map((m, i) => (
                    <div key={m.id}>
                      <div
                        className={cn({
                          'flex flex-col items-end justify-end': m.userName === userName,
                        })}
                      >
                        {i>0 && m.userName==msgObj[selectedGroup.groupName][i-1].userName && ((getTime(new Date(m.createdAt)) - getTime(new Date(msgObj[selectedGroup.groupName][i-1].createdAt)))/60000)<5.0?null:<div className="text-xs mt-2">
                          {m.userName}{' '}
                          <i className="text-slate-500">
                            {format(new Date(m.createdAt), 'eeee MM/dd/yyyy pp')}
                          </i>
                        </div>}
                        <div
                          className={cn(
                            'bg-lime-300 p-2 pl-3 pr-3 rounded mt-1 inline-block max-w-[800px]',
                            { 'bg-slate-200': m.userName === userName }
                          )}
                        >
                          <MarkdownView
                            markdown={m.message}
                            options={{ tables: true, emoji: true }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>

            <div className="flex items-center justify-center">
              <Input
                ref={inputRef}
                className="inline-block sm:w-[400px] md:w-[500px] lg:w-[1000px]"
                value={message}
                placeholder="Type a message"
                onKeyUp={(ev) => {
                  if (ev.key === 'Enter' && !!(selectedGroup?.id && message && loggedInUser)) {
                    sendMessage()
                  }
                }}
                onChange={(ev) => setMessage(ev.target.value)}
              ></Input>
              <Button
                disabled={!!!(selectedGroup?.id && message && loggedInUser)}
                className="primary"
                onClick={sendMessage}
              >
                Send
              </Button>
            </div>
           
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  )
}

export default ChatWindow

"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
//import { useUser, UserContextType } from "@/providers/user-provider";
import { Input } from "@/components/ui/input";
import { Plus, CirclePlus } from "lucide-react";
import { cn } from "@/utilities/cn";
import MarkdownView from "react-showdown";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separetor";
import GroupChatComponent from "./group";
import { ChatGroup } from "@/payload-types";
import { KeyValuePair } from "tailwindcss/types/config";
import { toast } from "sonner";
import {setState, useSelector} from '@/appState'
import useWebSocketConnectionHook from "./useWebSocketConnectionHook";
import {formatDistanceToNowStrict} from 'date-fns/formatDistanceToNowStrict'

const ChatWindow = () => {
  const [msgObj, setMsgObj] = useState<KeyValuePair<string, any[]>>({});
  const {loggedInUser, toggleWindow, groups, getMessages} = useSelector(s=>s);
 
  const io = useWebSocketConnectionHook((listenningOn: string, data: any) => {
    switch (listenningOn) {
      case "group":
        setMsgObj((pre) => {
          if (pre[data.groupName] && pre[data.groupName].length > 0) {
            const createdAt =
              pre[data.groupName][pre[data.groupName].length - 1].createdAt;

            if (createdAt === data.createdAt) {
              return pre;
            }
          }
          const newObj = Object.assign({}, pre);

          if (newObj[data.groupName]) {
            newObj[data.groupName] = [...newObj[data.groupName], data];
          } else {
            newObj[data.groupName] = [data];
          }
          return newObj;
        });
        toast.info(data.message)
        break;

      case "join":
        setState(pre=>{
          if (!pre.groups?.find((it) => it.groupName === data.groupName)) {
            if (data.users.find((it: any) => it.userId === pre.loggedInUser?.email)) {
              const list =pre.groups.slice();
              list.unshift(data);
              if(data.creatorId===pre.loggedInUser?.email){
                setSelectedGroup(data);
              }else{
                io.current?.disconnect()
                io.current?.connect();
              }
              return {...pre, groups:list}
            }
          }
          return pre;
        })
        break;
    }
  });
  const [message, setMessage] = useState("");
  const [height, setHeight] = useState(window.innerHeight - 180);
  const [isPrivate, setPrivate] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup>({} as any);
  
  useEffect(() => {
    const handleSize = () => {
      setHeight((_) => window.innerHeight - 180);
    };
    document.addEventListener("resize", handleSize);
    return () => document.removeEventListener("resize", handleSize);
  }, []);
  const sendMessage = () => {
    
    io.current?.emit(
      selectedGroup.groupName === "All Users" ? "all" : "group",
      {
        groupId: selectedGroup.id,
        groupName: selectedGroup.groupName,
        userName: `${loggedInUser?.name}`,
        message,
      }
    );
    setMessage("");
  };
  const userName = `${loggedInUser?.name}`;
  const getPrivateName=(groupName:string)=>{
    return groupName.replace(userName,'').replace(',','')
  }
  return (
    <TooltipProvider>
      <div style={{ height: toggleWindow ? height : 0 }}>
        <ResizablePanelGroup direction="horizontal" className="rounded border">
          <ResizablePanel defaultSize={25}>
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
                      const data = await getMessages(group.id);
                      console.log(data);
                      setMsgObj((pre) => ({ ...pre, [group.groupName]: data }));
                    }
                    setSelectedGroup(group);
                  }}
                  className={cn(
                    "p-2 cursor-pointer pl-4 font-semibold hover:bg-purple-100",
                    { "bg-purple-200": group.id === selectedGroup.id }
                  )}
                >
                  <span>{group.isPrivate?getPrivateName(group.groupName): group.groupName}</span>
                </div>
              ))}
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel className="bg-white" defaultSize={75}>
            <div className="flex items-center pl-4 h-12 border-b">
              {isPrivate === 0 ? (
                <span>{selectedGroup.isPrivate?getPrivateName(selectedGroup?.groupName): selectedGroup?.groupName}</span>
              ) : (
                <GroupChatComponent
                  isPrivate={isPrivate === 1}
                  setPrivate={setPrivate}
                  socket={io.current!}
                />
              )}
            </div>
            <ScrollArea style={{ height: height - 120 }} className="">
              <div className="m-2 ml-24 mr-24">
                {msgObj[selectedGroup.groupName]?.map((m) => (
                  <div key={m.id}>
                    <div
                      className={cn({
                        "flex flex-col items-end justify-end":
                          m.userName === userName,
                      })}
                    >
                      <div className="text-xs">
                        {m.userName}{" "}
                        <i className="text-slate-500">
                          {formatDistanceToNowStrict(new Date(m.createdAt),{addSuffix:true})}
                        </i>
                      </div>
                      <div
                        className={cn(
                          "bg-rose-100 p-2 pl-3 pr-3 rounded mt-1 mb-4 inline-block max-w-[800px]",
                          { "bg-slate-200": m.userName === userName }
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
            </ScrollArea>

            <div className="flex items-center justify-center">
              <Textarea
                className="inline-block md:w-[800px] lg:w-[1000px]"
                value={message}
                placeholder="Type a message"
                onChange={(ev) => setMessage(ev.target.value)}
              ></Textarea>
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
  );
};

export default ChatWindow;

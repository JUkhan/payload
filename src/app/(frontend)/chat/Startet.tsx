"use client";


import { useEffect } from "react";
import { ChatGroup, ChatMessage, User, } from "@/payload-types";
import {setState, getUnreadStatus, saveToLocal} from '@/components/chat/state'

const Starter = ({ users, groups, getMessages, createGroup, loggedInUser, unreadStatus }: { unreadStatus:Record<string, number>, users: any; loggedInUser:User, groups: ChatGroup[], getMessages:(groupId:string)=>Promise<ChatMessage[]>, createGroup:(data:any)=>Promise<[string|null, ChatGroup|null]> }) => {
  
  useEffect(() => {
    const localUnreadStatus=getUnreadStatus()
    console.log('local status', JSON.stringify(localUnreadStatus))
    Object.keys(unreadStatus).forEach(key=>{
      if(localUnreadStatus[key]){
        localUnreadStatus[key]+=unreadStatus[key]
      }else{
        localUnreadStatus[key]=unreadStatus[key]
      }
    })
    console.log('local status2', JSON.stringify(localUnreadStatus))
    setState({
      loggedInUser,
      toggleWindow: true,
      getMessages,
      createGroup,
      unreadStatus:localUnreadStatus,
      users,
      groups: groups.filter(
        (it) =>
          it.groupName === "All Users" ||
          it.users?.some((it) => it.userId === loggedInUser?.email)
      )
    });
   
    saveToLocal(localUnreadStatus)
  
    return () => {
      setState({toggleWindow: false });
    };
  }, [createGroup, getMessages, groups, loggedInUser, users, unreadStatus]);
  return <div></div>;
};

export default Starter;

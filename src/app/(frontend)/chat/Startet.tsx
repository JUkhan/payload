"use client";


import { useEffect } from "react";
import { ChatGroup, ChatMessage, User } from "@/payload-types";
import {setState} from '@/components/chat/state'

const Starter = ({ users, groups, getMessages, createGroup, loggedInUser }: { users: any; loggedInUser:User, groups: ChatGroup[], getMessages:(groupId:string)=>Promise<ChatMessage[]>, createGroup:(data:any)=>Promise<[string|null, ChatGroup|null]> }) => {
  
  useEffect(() => {
    setState({
      loggedInUser,
      toggleWindow: true,
      getMessages,
      createGroup,
      users,
      groups: groups.filter(
        (it) =>
          it.groupName === "All Users" ||
          it.users?.some((it) => it.userId === loggedInUser?.email)
      )
    });
    return () => {
      setState({toggleWindow: false });
    };
  }, [createGroup, getMessages, groups, loggedInUser, users]);
  return <div></div>;
};

export default Starter;

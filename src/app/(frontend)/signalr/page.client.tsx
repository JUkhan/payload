'use client'
import { sendMessage } from '@microsoft/signalr/dist/esm/Utils';
import ChatWindow from '@/components/signalrClient/chatWindow'
import React, { useEffect } from 'react';


const MakeComponent = ({users, user}:{users:any[], user:any}) => {
 const unreadSignal=(status)=>{
  console.log('Unread Status::', status)
 }
  
  return <div>
    <ChatWindow unreadStatusSignal={unreadSignal} hubUrl='https://localhost:7111/chatHub' currentUser={user} userList={users} hideWindow={false} bufferHeight={280}/>
  </div>;
};

export default MakeComponent;



"use client";

import React, { use, useState } from "react";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import {useSelector} from './state'

const GroupChatComponent = ({
  isPrivate,
  setPrivate,
  socket,
}: {
  isPrivate: boolean;
  setPrivate: any;
  socket: Socket;
}) => {
  const { loggedInUser, createGroup,  users} = useSelector(s=>s);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [group, setGroup] = useState("");
  const [privateUserId, setValue] = React.useState("");
 
  const submitHandler = async () => {
    const item = {
      groupName: group,
      users: selectedUsers.map((userId) => ({ userId })),
    };
    if (createGroup) {
      const [err, data] = await createGroup(item);
      if(data){
      socket.emit("join", {...data, creatorId:loggedInUser?.email});
      }else{
        console.log(err)
        toast.error(err)
      }
    }
    setPrivate(0);
  };

  const submitPrivateHandler = async () => {
    const anotherUser = users?.find((it) => it.value === privateUserId);
    const names = [anotherUser?.label, loggedInUser?.name];
    const item = {
      groupName: names.toSorted().join(","),
      isPrivate: true,
      users: [loggedInUser?.email, anotherUser?.value].map((userId) => ({ userId })),
    };
    
    if (createGroup) {
      const [err, data] = await createGroup(item);
      if(data){
        socket.emit("join", {...data, creatorId:loggedInUser?.email});
      }else{
        console.log(err)
        toast.error(err)
      }
    }
    setPrivate(0);
  };

  return (
    <div className="flex items-center gap-2">
      {!isPrivate ? (
        <>
          <Input
            placeholder="Group Name"
            className="w-[200px]"
            value={group}
            onChange={(ev) => setGroup(ev.target.value)}
          />
          <MultiSelect
            className="min-w-[150px]"
            options={users ?? []}
            onValueChange={setSelectedUsers}
            placeholder="Select Users"
            variant="inverted"
            maxCount={1}
          />
        </>
      ) : (
        <Combobox
          items={users?.filter((it) => it.value !== loggedInUser?.email) as any}
          value={privateUserId}
          setValue={setValue}
        />
      )}
      <Button
        disabled={
          isPrivate
            ? !!!privateUserId
            : !!!(group && selectedUsers && selectedUsers.length > 1)
        }
        size="sm"
        onClick={() => (isPrivate ? submitPrivateHandler() : submitHandler())}
      >
        Submit
      </Button>
      <Button size="sm" variant="outline" onClick={() => setPrivate(0)}>
        X
      </Button>
    </div>
  );
};

export default GroupChatComponent;

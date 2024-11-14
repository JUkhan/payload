import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/providers/user-provider";
import type { PostComment } from "@/payload-types";
import { EllipsisVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UpdateComment from "./update";
type props = {
  item: PostComment;
  onUpdate: any;
  onDelete: any;
};
const Mutate = ({ item, onUpdate, onDelete }: props) => {
  const { user } = useUser();
  const [open, setOPen] = useState(false);
  const [update, setUpdate] = useState(false);
  if (!(user && user.id === item.userId)) return null;
  return (
    <div>
      <div className="flex flex-row-reverse">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <EllipsisVertical className="h-4 w-4"></EllipsisVertical>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div>
              <Button onClick={() => setUpdate(true)} variant="link">
                Update
              </Button>
            </div>
            <div>
              <Button onClick={() => setOPen((_) => true)} variant="link">
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete your comment permanently?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOPen((_) => false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setOPen((_) => false);
                onDelete(item);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {update && (
        <UpdateComment
          item={item}
          onUpdate={onUpdate}
          cb={() => setUpdate(false)}
        />
      )}
    </div>
  );
};

export default Mutate;

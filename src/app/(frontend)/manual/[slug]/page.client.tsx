'use client'
import React from 'react'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/cn'
type Menu = {
  title: string;
  content?: any;
  url?: string;
  children?: Menu[];
  expand?: boolean;
  active?:string;
  directContent: boolean;
};
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import {
  Card,
  CardContent,
 
} from '@/components/ui/card'
import SearchComponent from './search.client'
import Link from "next/link";

const MenuItem: React.FC<{
  item: Menu;
  setContent: (con: any) => any;
  active: string;
  setActive: (active: any) => any;
  loading?: boolean;
  setLoading?: any;
}> = ({ item, setContent, active, setActive, loading, setLoading }) => {
  const [isExpand, setExpand] = React.useState(item.expand ?? false);
  useEffect(()=>{
    if(item.active){
      setActive(item.active)
      setContent(item.content)
    }
  },[item])
  const clickHandler = (ev: any) => {
    ev.stopPropagation();
    if (item.url && !item.expand) {
      setLoading(true);
    }
    setContent(item.content);
    if (item.children) {
      setExpand((prev) => !prev);
    }
    setActive((pre: any) => item.title);
  };
  const linkText = (
    <span
      className={cn("w-[100%] pl-2 inline-block hover:bg-cyan-100", {
        "bg-cyan-400":
          (item.content || item.directContent) && active === item.title,
      })}
    > 
<span> {!item.directContent && item.children && (isExpand ? "▼" : "▶")} </span> 
<span>{loading && active === item.title && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block"></Loader2>
      )}</span>
    {item.title} 
    </span>
  );
  const _link = item.url ? (
    <Link className="flex" prefetch={true} href={item.url}>
      {linkText}
    </Link>
  ) : (
    linkText
  );
  return (
    <li onClick={clickHandler} className="cursor-pointer">
     
      {_link}
      {isExpand && item.children && (
        <menu className="ml-4">
          {item.children.map((it, idx) => (
            <MenuItem
              key={idx}
              item={it}
              setContent={setContent}
              active={active}
              setActive={setActive}
              loading={loading}
              setLoading={setLoading}
            />
          ))}
        </menu>
      )}
    </li>
  );
};
const Topic: React.FC<{
  topics: Menu[];
  setContent: any;
  active: any;
  setActive: any;
}> = ({ topics, setContent, active, setActive }) => {
  const [val, setVal] = useState("");
  const [_topics, setTopics] = useState(topics);
  return (
    <div className="mt-4">
      <Input
        value={val}
        placeholder="Search..."
        onChange={(e: any) => {
          setVal((_) => e.target.value);
          const _val = e.target.value.trim().toLowerCase();
          setTopics((_) =>
            topics.filter((it) => it.title.toLowerCase().includes(_val))
          );
        }}
      />
      <menu className="mt-2">
        {_topics.map((it, idx) => (
          <MenuItem
            setContent={setContent}
            key={idx}
            item={it}
            active={active}
            setActive={setActive}
          />
        ))}
      </menu>
    </div>
  );
};
const ManualComponent: React.FC<{ menuList: Menu[]; topics: Menu[] }> = ({
  menuList,
  topics,
}) => {
  const [content, setContent] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = React.useState("");
  useEffect(() => { 
    setLoading(false);
  }, [menuList]);
  return (
    <div className="inline-flex">
      <Tabs defaultValue="manual" className="min-w-[400px] h-svh">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual">Contents</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <Card>
            <CardContent>
              <menu className="mt-4">
                {menuList.map((it, idx) => (
                  <MenuItem
                    setContent={setContent}
                    key={idx}
                    item={it}
                    active={active}
                    setActive={setActive}
                    loading={loading}
                    setLoading={setLoading}
                  />
                ))}
              </menu>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="topics">
          <Card>
            <CardContent>
              <Topic
                active={active}
                setActive={setActive}
                topics={topics}
                setContent={setContent}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="search">
          <Card>
            <CardContent>
              <SearchComponent setContent={setContent} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="mark-context">
        {content ? (
          <RichText className="pl-8" content={content} enableGutter={false} />
        ) : (
          <div className="h-[400px]"></div>
        )}
      </div>
    </div>
  );
};

export default ManualComponent;

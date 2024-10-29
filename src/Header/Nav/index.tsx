'use client'

import React, { useMemo } from 'react'
import { cn } from '@/utilities/cn'
import type { Header as HeaderType } from '@/payload-types'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from 'usehooks-ts'

import { HamburgerMenuIcon } from "@radix-ui/react-icons"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [links, dic] = useMemo(() => {
    const navItems = header?.navItems || [] // Moved inside useMemo
    const dic = new Map<string, [any]>()
    const links: [any] = [] as any
    for (const it of navItems) {
      if (it.link.parent) {
        if (dic.has(it.link.parent)) {
          dic.get(it.link.parent)?.push(it.link)
        } else {
          dic.set(it.link.parent, [it.link])
        }
      } else {
        links.push(it.link)
      }
    }
    return [links, dic]
  }, [header]) // Ensure header is a dependency

  const content = isMobile ? (
    <NavSheet side="right" links={links} dic={dic} />
  ) : (
    <nav className="flex gap-3 items-center">
      <Nav links={links} dic={dic} orientation="vertical" />
    </nav>
  )

  return content
}

type NavLtem = { url: string; label: string }
function Nav({
  links,
  dic,
  orientation,
}: {
  links: [NavLtem]
  dic: Map<string, [NavLtem]>
  orientation: 'vertical' | 'horizontal'
}) {
  return (
    <NavigationMenu orientation={orientation}>
      <NavigationMenuList>
        {links.map((link) => (
          <NavigationMenuItem key={link.label}>
            {dic.has(link.label) ? (
              <>
                <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flax flex-col p-2 w-[400px]">
                    {dic.get(link.label)?.map((it) => (
                      <NavigationMenuLink
                        asChild
                        key={it.label}
                        className={cn(navigationMenuTriggerStyle(), 'w-full justify-start')}
                      >
                        <Link href={it.url}>{it.label}</Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href={link.url!}>{link.label}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export function NavSheet({
  links,
  dic,
  side,
}: {
  links: [NavLtem]
  dic: Map<string, [NavLtem]>
  side: 'top' | 'left' | 'right'
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetHeader>
        <SheetTitle></SheetTitle>
      </SheetHeader>
      <SheetDescription></SheetDescription>
      <SheetTrigger asChild>
        <Button className='rounded-full' title='Menu list'>
          <HamburgerMenuIcon/>
        </Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList className="max-h-[500px]">
            <CommandEmpty>No results found.</CommandEmpty>
            {links.map((it) =>
              dic.has(it.label) ? (
                <React.Fragment key={it.label}>
                  <CommandGroup heading={it.label}>
                    {dic.get(it.label)?.map((sub, inx) => (
                      <CommandItem key={inx}>
                        <Link key={inx} href={sub.url}>
                          <div
                            onClick={() => setOpen((open) => !open)}
                            className="block cursor-pointer"
                          >
                            {sub.label}
                          </div>{' '}
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </React.Fragment>
              ) : (
                <CommandItem key={it.label}>
                  <Link href={it.url}>
                    <div onClick={() => setOpen((open) => !open)} className="block cursor-pointer">
                      {it.label}
                    </div>{' '}
                  </Link>
                </CommandItem>
              ),
            )}
          </CommandList>
        </Command>
      </SheetContent>
    </Sheet>
  )
}

"use client";

import { RootProvider } from "fumadocs-ui/provider";
import { ReactNode } from "react";

export function FumadocsProvider({ children }: { children: ReactNode }) {
  return <RootProvider>{children}</RootProvider>;
}

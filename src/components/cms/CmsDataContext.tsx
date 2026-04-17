"use client";

import React, { createContext, useContext } from "react";
import { MenuConfig, PageConfig, PostConfig, SiteConfig } from "@/lib/supabase-content";

type CmsDataValue = {
  site: SiteConfig | null;
  pages: PageConfig[];
  posts: PostConfig[];
  menus: MenuConfig[];
};

const CmsDataContext = createContext<CmsDataValue>({
  site: null,
  pages: [],
  posts: [],
  menus: [],
});

export const CmsDataProvider: React.FC<
  React.PropsWithChildren<CmsDataValue>
> = ({ children, site, pages, posts, menus }) => {
  return (
    <CmsDataContext.Provider
      value={{
        site,
        pages,
        posts,
        menus,
      }}
    >
      {children}
    </CmsDataContext.Provider>
  );
};

export function useCmsData() {
  return useContext(CmsDataContext);
}

"use client";

import { Suspense, useEffect, useState } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { Canvas } from "@/components/editor/Canvas";
import { OnboardingWizard } from "@/components/editor/OnboardingWizard";
import { FloatingEditButton } from "@/components/editor/FloatingEditButton";
import { ShareLink } from "@/components/editor/ShareLink";
import { EnvironmentIndicator } from "@/components/editor/EnvironmentIndicator";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEditorStore } from "@/store/editor-store";
import {
  listSites,
  loadSiteResources,
  loadPost,
} from "@/lib/cms-service";
import { loadPage } from "@/lib/page-service";
import { CmsDataProvider } from "@/components/cms/CmsDataContext";
import { PropertyPanel } from "@/components/editor/PropertyPanel";
import { MenuConfig, PageConfig, PostConfig, SiteConfig } from "@/lib/supabase-content";

function EditorContent() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSelectSite, setShowSelectSite] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [cmsData, setCmsData] = useState<{
    site: SiteConfig | null;
    pages: PageConfig[];
    posts: PostConfig[];
    menus: MenuConfig[];
  }>({
    site: null,
    pages: [],
    posts: [],
    menus: [],
  });
  const { currentPageId, components, documentType, siteId } = useEditorStore();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const sites = await listSites();

        if (sites.length === 0) {
          setShowOnboarding(true);
          setShowSelectSite(false);
        } else if (!currentPageId) {
          setShowOnboarding(false);
          setShowSelectSite(true);
        } else {
          if (components.length === 0) {
            try {
              if (documentType === "post") {
                const post = await loadPost(currentPageId);
                useEditorStore.getState().loadPost(post);
              } else {
                const page = await loadPage(currentPageId);
                useEditorStore.getState().loadPage(page);
              }
            } catch (error) {
              console.error("Failed to load document:", error);
              setShowSelectSite(true);
            }
          }

          setShowOnboarding(false);
          setShowSelectSite(false);
        }
      } catch (error) {
        console.error("Failed to check sites:", error);
        setShowOnboarding(true);
        setShowSelectSite(false);
      } finally {
        setLoading(false);
      }
    };

    void checkOnboarding();
  }, [components.length, currentPageId, documentType, refreshNonce]);

  useEffect(() => {
    const refreshCmsData = async () => {
      if (!siteId) {
        setCmsData({
          site: null,
          pages: [],
          posts: [],
          menus: [],
        });
        return;
      }

      try {
        const [sites, siteResources] = await Promise.all([
          listSites(),
          loadSiteResources(siteId),
        ]);

        setCmsData({
          site: sites.find((site) => site.id === siteId) || null,
          pages: siteResources.pages,
          posts: siteResources.posts,
          menus: siteResources.menus,
        });
      } catch (error) {
        console.error("Failed to refresh CMS data:", error);
      }
    };

    void refreshCmsData();
  }, [currentPageId, documentType, refreshNonce, siteId]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowSelectSite(false);
    setLoading(true);
    setRefreshNonce((current) => current + 1);
  };

  const handleCreateNewSite = () => {
    setShowOnboarding(true);
    setShowSelectSite(false);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <div className="h-screen flex flex-col">
        <Toolbar
          onCmsMutated={() => setRefreshNonce((current) => current + 1)}
        />
        <div className="flex-1 overflow-auto">
          <OnboardingWizard
            isOpen={showOnboarding}
            onComplete={handleOnboardingComplete}
          />
        </div>
        <EnvironmentIndicator />
      </div>
    );
  }

  if (showSelectSite) {
    return (
      <div className="h-screen flex flex-col">
        <Toolbar
          onCmsMutated={() => setRefreshNonce((current) => current + 1)}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-50 overflow-auto">
          <div className="text-center max-w-md px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pick a Site
            </h2>
            <p className="text-gray-600 mb-8">
              Open the CMS navigator to choose a site, page, post, or menu to work on.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  const toolbar = document.querySelector(
                    "[data-sites-button]",
                  ) as HTMLButtonElement;
                  toolbar?.click();
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Open CMS Navigator
              </button>
              <button
                onClick={handleCreateNewSite}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-red-600 hover:text-red-600 transition-colors font-semibold"
              >
                Create New Site
              </button>
            </div>
          </div>
        </div>
        <EnvironmentIndicator />
      </div>
    );
  }

  return (
    <CmsDataProvider
      site={cmsData.site}
      pages={cmsData.pages}
      posts={cmsData.posts}
      menus={cmsData.menus}
    >
      <div className="h-screen flex flex-col">
        <Toolbar
          onCmsMutated={() => setRefreshNonce((current) => current + 1)}
        />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-auto">
            <Canvas />
          </div>
          <PropertyPanel />
        </div>
        <FloatingEditButton onShareClick={() => setShowShareLink(true)} />
        <ShareLink
          isOpen={showShareLink}
          onClose={() => setShowShareLink(false)}
        />
        <EnvironmentIndicator />
      </div>
    </CmsDataProvider>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        }
      >
        <EditorContent />
      </Suspense>
    </ProtectedRoute>
  );
}

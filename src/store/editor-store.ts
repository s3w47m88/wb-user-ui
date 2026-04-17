import { create } from "zustand";
import {
  CmsDocument,
  ComponentData,
  DocumentStatus,
  DocumentType,
  PageConfig,
  PostConfig,
  ThemeConfig,
} from "@/lib/supabase-content";
import {
  createPage,
  createPost,
  loadDocumentBundle,
  updatePage,
  updatePost,
} from "@/lib/cms-service";
import {
  defaultTheme,
  isValidUuid,
  normalizePageId,
  slugify,
} from "@/lib/builder-pages";
import { normalizeImagesProp } from "@/lib/editor-images";

type EditorState = {
  components: ComponentData[];
  selectedComponentId: string | null;
  theme: ThemeConfig;
  isEditing: boolean;
  currentPageId: string | null;
  siteId: string | null;
  pageName: string;
  documentType: DocumentType;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  excerpt: string;
  status: DocumentStatus;
  menuTitle: string;
  author: string;
  publishedDate: string;
  featuredImageUrl: string;
  autoSaveTimeout: NodeJS.Timeout | null;
  isSaving: boolean;

  addComponent: (type: string, props: Record<string, unknown>) => void;
  updateComponent: (id: string, props: Record<string, unknown>) => void;
  removeComponent: (id: string) => void;
  reorderComponents: (newOrder: ComponentData[]) => void;
  selectComponent: (id: string | null) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  setEditing: (isEditing: boolean) => void;
  resetEditor: () => void;
  loadPage: (page: PageConfig) => void;
  loadPost: (post: PostConfig) => void;
  loadDocument: (document: CmsDocument) => void;
  setPageName: (name: string) => void;
  setCurrentPageId: (id: string | null) => void;
  setDocumentType: (documentType: DocumentType) => void;
  updateDocumentMeta: (
    patch: Partial<{
      slug: string;
      metaTitle: string;
      metaDescription: string;
      metaKeywords: string;
      excerpt: string;
      status: DocumentStatus;
      menuTitle: string;
      author: string;
      publishedDate: string;
      featuredImageUrl: string;
    }>,
  ) => void;
  setSiteId: (siteId: string | null) => void;
  triggerAutoSave: () => void;
  saveNow: () => void;
};

const getInitialDocumentId = (): string | null => {
  if (typeof window !== "undefined") {
    const storedId =
      localStorage.getItem("currentDocumentId") ||
      localStorage.getItem("currentPageId");
    return normalizePageId(storedId);
  }

  return null;
};

const getInitialDocumentType = (): DocumentType => {
  if (typeof window === "undefined") {
    return "page";
  }

  return localStorage.getItem("currentDocumentType") === "post" ? "post" : "page";
};

export const useEditorStore = create<EditorState>((set, get) => {
  const getErrorCode = (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : undefined;

  const persistDocumentSelection = (documentId: string | null, documentType: DocumentType) => {
    if (typeof window === "undefined") {
      return;
    }

    if (documentId) {
      localStorage.setItem("currentDocumentId", documentId);
      localStorage.setItem("currentPageId", documentId);
    } else {
      localStorage.removeItem("currentDocumentId");
      localStorage.removeItem("currentPageId");
    }

    localStorage.setItem("currentDocumentType", documentType);
  };

  const performSave = async () => {
    set({ isSaving: true });
    const state = get();

    try {
      if (!isValidUuid(state.siteId)) {
        throw new Error("Cannot save a document without a selected site.");
      }

      if (state.documentType === "post") {
        const postData = {
          site_id: state.siteId,
          name: state.pageName,
          slug: state.slug.trim() || slugify(state.pageName || "post"),
          menu_title: state.menuTitle.trim() || state.pageName,
          meta_title: state.metaTitle.trim() || state.pageName,
          meta_description: state.metaDescription.trim() || null,
          meta_keywords: state.metaKeywords.trim() || null,
          excerpt: state.excerpt.trim() || null,
          status: state.status,
          author: state.author.trim() || null,
          published_date: state.publishedDate.trim() || null,
          featured_image_url: state.featuredImageUrl.trim() || null,
          components: state.components,
          theme: state.theme,
        };

        const savedPost = state.currentPageId
          ? await updatePost(state.currentPageId, postData)
          : await createPost(postData);

        persistDocumentSelection(savedPost.id, "post");
        set({
          currentPageId: savedPost.id,
          siteId: isValidUuid(savedPost.site_id) ? savedPost.site_id : state.siteId,
          slug: savedPost.slug || postData.slug,
          metaTitle: savedPost.meta_title || "",
          metaDescription: savedPost.meta_description || "",
          metaKeywords: savedPost.meta_keywords || "",
          excerpt: savedPost.excerpt || "",
          status: (savedPost.status as DocumentStatus | null) || "draft",
          menuTitle: savedPost.menu_title || "",
          author: savedPost.author || "",
          publishedDate: savedPost.published_date || "",
          featuredImageUrl: savedPost.featured_image_url || "",
        });
      } else {
        const pageData = {
          site_id: state.siteId,
          name: state.pageName,
          slug: state.slug.trim() || slugify(state.pageName || "page"),
          meta_title: state.metaTitle.trim() || state.pageName,
          meta_description: state.metaDescription.trim() || null,
          meta_keywords: state.metaKeywords.trim() || null,
          excerpt: state.excerpt.trim() || null,
          status: state.status,
          components: state.components,
          theme: state.theme,
        };

        const savedPage = state.currentPageId
          ? await updatePage(state.currentPageId, pageData)
          : await createPage(pageData);

        persistDocumentSelection(savedPage.id, "page");
        set({
          currentPageId: savedPage.id,
          siteId: isValidUuid(savedPage.site_id) ? savedPage.site_id : state.siteId,
          slug: savedPage.slug || pageData.slug,
          metaTitle: savedPage.meta_title || "",
          metaDescription: savedPage.meta_description || "",
          metaKeywords: savedPage.meta_keywords || "",
          excerpt: savedPage.excerpt || "",
          status: (savedPage.status as DocumentStatus | null) || "draft",
        });
      }
    } catch (error) {
      console.error("Auto-save failed:", error);

      if (getErrorCode(error) === "NOT_FOUND") {
        set({ currentPageId: null });
      }
    } finally {
      set({ isSaving: false });
    }
  };

  return {
    components: [],
    selectedComponentId: null,
    theme: defaultTheme,
    isEditing: true,
    currentPageId: getInitialDocumentId(),
    siteId: null,
    pageName: "Untitled Page",
    documentType: getInitialDocumentType(),
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    excerpt: "",
    status: "draft",
    menuTitle: "",
    author: "",
    publishedDate: "",
    featuredImageUrl: "",
    autoSaveTimeout: null,
    isSaving: false,

    addComponent: (type, props) =>
      set((state) => {
        const newComponent: ComponentData = {
          id: crypto.randomUUID(),
          type,
          props,
          order: state.components.length,
        };
        get().triggerAutoSave();
        return { components: [...state.components, newComponent] };
      }),

    updateComponent: (id, props) =>
      set((state) => {
        const updated = {
          components: state.components.map((comp) => {
            if (comp.id === id) {
              const nextProps = { ...props };

              if ("images" in nextProps && comp.type === "gallery") {
                const normalizedImages = normalizeImagesProp(nextProps.images);

                if (Array.isArray(normalizedImages)) {
                  nextProps.images = normalizedImages;
                } else {
                  delete nextProps.images;
                }
              }

              return { ...comp, props: { ...comp.props, ...nextProps } };
            }
            return comp;
          }),
        };
        get().triggerAutoSave();
        return updated;
      }),

    removeComponent: (id) =>
      set((state) => {
        get().triggerAutoSave();
        return {
          components: state.components
            .filter((comp) => comp.id !== id)
            .map((comp, index) => ({ ...comp, order: index })),
          selectedComponentId:
            state.selectedComponentId === id ? null : state.selectedComponentId,
        };
      }),

    reorderComponents: (newOrder) =>
      set(() => {
        get().triggerAutoSave();
        return {
          components: newOrder.map((comp, index) => ({
            ...comp,
            order: index,
          })),
        };
      }),

    selectComponent: (id) => set({ selectedComponentId: id }),

    updateTheme: (theme) =>
      set((state) => {
        const updatedTheme = {
          ...state.theme,
          ...theme,
          colors: { ...state.theme.colors, ...(theme.colors || {}) },
          fonts: { ...state.theme.fonts, ...(theme.fonts || {}) },
        };
        get().triggerAutoSave();
        return { theme: updatedTheme };
      }),

    setEditing: (isEditing) => set({ isEditing }),

    resetEditor: () => {
      persistDocumentSelection(null, "page");
      set({
        components: [],
        selectedComponentId: null,
        theme: defaultTheme,
        isEditing: false,
        currentPageId: null,
        siteId: null,
        pageName: "Untitled Page",
        documentType: "page",
        slug: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        excerpt: "",
        status: "draft",
        menuTitle: "",
        author: "",
        publishedDate: "",
        featuredImageUrl: "",
      });
    },

    loadPage: (page) => {
      get().loadDocument(page);
    },

    loadPost: (post) => {
      get().loadDocument(post);
    },

    loadDocument: (document) => {
      const validId = normalizePageId(document.id);
      persistDocumentSelection(validId, document.document_type);

      set((state) => ({
        components: document.components,
        theme: document.theme,
        currentPageId: validId ?? state.currentPageId,
        siteId: isValidUuid(document.site_id) ? document.site_id : state.siteId,
        pageName: document.name,
        documentType: document.document_type,
        slug: document.slug || "",
        metaTitle: document.meta_title || "",
        metaDescription: document.meta_description || "",
        metaKeywords: document.meta_keywords || "",
        excerpt: document.excerpt || "",
        status: (document.status as DocumentStatus | null) || "draft",
        menuTitle:
          document.document_type === "post" ? document.menu_title || "" : "",
        author: document.document_type === "post" ? document.author || "" : "",
        publishedDate:
          document.document_type === "post" ? document.published_date || "" : "",
        featuredImageUrl:
          document.document_type === "post"
            ? document.featured_image_url || ""
            : "",
        selectedComponentId: null,
      }));
    },

    setPageName: (name) => {
      set({ pageName: name });
      get().triggerAutoSave();
    },

    setCurrentPageId: (id) => {
      persistDocumentSelection(id, get().documentType);
      set({ currentPageId: id });
    },

    setDocumentType: (documentType) => {
      persistDocumentSelection(get().currentPageId, documentType);
      set({ documentType });
    },

    updateDocumentMeta: (patch) => {
      set((state) => ({
        slug: patch.slug ?? state.slug,
        metaTitle: patch.metaTitle ?? state.metaTitle,
        metaDescription: patch.metaDescription ?? state.metaDescription,
        metaKeywords: patch.metaKeywords ?? state.metaKeywords,
        excerpt: patch.excerpt ?? state.excerpt,
        status: patch.status ?? state.status,
        menuTitle: patch.menuTitle ?? state.menuTitle,
        author: patch.author ?? state.author,
        publishedDate: patch.publishedDate ?? state.publishedDate,
        featuredImageUrl: patch.featuredImageUrl ?? state.featuredImageUrl,
      }));
      get().triggerAutoSave();
    },

    setSiteId: (siteId) => set({ siteId }),

    triggerAutoSave: () => {
      const state = get();

      if (state.autoSaveTimeout) {
        clearTimeout(state.autoSaveTimeout);
      }

      const timeout = setTimeout(() => {
        void performSave();
      }, 1200);

      set({ autoSaveTimeout: timeout });
    },

    saveNow: () => {
      const state = get();
      if (state.autoSaveTimeout) {
        clearTimeout(state.autoSaveTimeout);
        set({ autoSaveTimeout: null });
      }
      void performSave();
    },
  };
});

export async function hydrateCurrentDocumentBundle() {
  const state = useEditorStore.getState();

  if (!state.currentPageId) {
    return null;
  }

  return loadDocumentBundle(state.documentType, state.currentPageId);
}

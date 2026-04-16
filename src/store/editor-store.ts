import { create } from "zustand";
import { ComponentData, ThemeConfig, PageConfig } from "@/lib/supabase-content";
import { savePage, updatePage } from "@/lib/page-service";
import {
  defaultTheme,
  isValidUuid,
  normalizePageId,
} from "@/lib/builder-pages";

type EditorState = {
  components: ComponentData[];
  selectedComponentId: string | null;
  theme: ThemeConfig;
  isEditing: boolean;
  currentPageId: string | null;
  siteId: string | null;
  pageName: string;
  autoSaveTimeout: NodeJS.Timeout | null;
  isSaving: boolean;

  // Actions
  addComponent: (type: string, props: Record<string, unknown>) => void;
  updateComponent: (id: string, props: Record<string, unknown>) => void;
  removeComponent: (id: string) => void;
  reorderComponents: (newOrder: ComponentData[]) => void;
  selectComponent: (id: string | null) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  setEditing: (isEditing: boolean) => void;
  resetEditor: () => void;
  loadPage: (page: PageConfig) => void;
  setPageName: (name: string) => void;
  setCurrentPageId: (id: string | null) => void;
  triggerAutoSave: () => void;
  saveNow: () => void;
};

// Initialize currentPageId from localStorage if available
const getInitialPageId = (): string | null => {
  if (typeof window !== "undefined") {
    const storedId = localStorage.getItem("currentPageId");
    return normalizePageId(storedId);
  }
  return null;
};

export const useEditorStore = create<EditorState>((set, get) => {
  const getErrorCode = (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
      ? error.code
      : undefined;

  const performSave = async () => {
    set({ isSaving: true });
    const { components, theme, pageName, currentPageId, siteId } = get();

    try {
      const pageData = {
        name: pageName,
        components,
        theme,
        ...(isValidUuid(siteId) ? { site_id: siteId } : {}),
      };

      if (currentPageId) {
        try {
          await updatePage(currentPageId, pageData);
          console.log("Auto-saved successfully");
        } catch (updateError: unknown) {
          console.error(
            "Failed to update page, trying to create new:",
            updateError,
          );
          if (getErrorCode(updateError) === "NOT_FOUND") {
            const savedPage = await savePage(pageData);
            set({
              currentPageId: savedPage.id,
              siteId: isValidUuid(savedPage.site_id) ? savedPage.site_id : null,
            });
            console.log("Page created and auto-saved");
          } else {
            throw updateError;
          }
        }
      } else {
        const savedPage = await savePage(pageData);
        set({
          currentPageId: savedPage.id,
          siteId: isValidUuid(savedPage.site_id) ? savedPage.site_id : null,
        });
        console.log("Page created and auto-saved");
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      set({ isSaving: false });
    }
  };

  return {
    components: [],
    selectedComponentId: null,
    theme: defaultTheme,
    isEditing: true,
    currentPageId: getInitialPageId(),
    siteId: null,
    pageName: "Untitled Page",
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
              // Handle special case for gallery images
              if (props.images && typeof props.images === "string") {
                try {
                  props.images = JSON.parse(props.images);
                } catch (e) {
                  console.error("Failed to parse images", e);
                }
              }
              return { ...comp, props: { ...comp.props, ...props } };
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
      // Clear persisted page ID
      if (typeof window !== "undefined") {
        localStorage.removeItem("currentPageId");
      }
      set({
        components: [],
        selectedComponentId: null,
        theme: defaultTheme,
        isEditing: false,
        currentPageId: null,
        siteId: null,
        pageName: "Untitled Page",
      });
    },

    loadPage: (page) => {
      const validPageId = normalizePageId(page.id);

      if (typeof window !== "undefined") {
        if (validPageId) {
          localStorage.setItem("currentPageId", validPageId);
        } else {
          localStorage.removeItem("currentPageId");
        }
      }

      set((state) => ({
        components: page.components,
        theme: page.theme,
        currentPageId: validPageId ?? state.currentPageId,
        siteId: isValidUuid(page.site_id) ? page.site_id : state.siteId,
        pageName: page.name,
        selectedComponentId: null,
      }));
    },

    setPageName: (name) => {
      set({ pageName: name });
      get().triggerAutoSave();
    },

    setCurrentPageId: (id) => set({ currentPageId: id }),

    triggerAutoSave: () => {
      const state = get();

      if (state.autoSaveTimeout) {
        clearTimeout(state.autoSaveTimeout);
      }

      const timeout = setTimeout(() => {
        void performSave();
      }, 2000);

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

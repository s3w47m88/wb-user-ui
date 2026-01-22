import { create } from 'zustand';
import { ComponentData, ThemeConfig, PageConfig } from '@/lib/supabase';
import { savePage, updatePage } from '@/lib/page-service';

type EditorState = {
  components: ComponentData[];
  selectedComponentId: string | null;
  theme: ThemeConfig;
  isEditing: boolean;
  currentPageId: string | null;
  pageName: string;
  autoSaveTimeout: NodeJS.Timeout | null;
  isSaving: boolean;

  // Actions
  addComponent: (type: string, props: Record<string, any>) => void;
  updateComponent: (id: string, props: Record<string, any>) => void;
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
};

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f59e0b',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  mode: 'light',
};

// Initialize currentPageId from localStorage if available
const getInitialPageId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('currentPageId');
  }
  return null;
};

export const useEditorStore = create<EditorState>((set, get) => ({
  components: [],
  selectedComponentId: null,
  theme: defaultTheme,
  isEditing: true,
  currentPageId: getInitialPageId(),
  pageName: 'Untitled Page',
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
            if (props.images && typeof props.images === 'string') {
              try {
                props.images = JSON.parse(props.images);
              } catch (e) {
                console.error('Failed to parse images', e);
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
        components: newOrder.map((comp, index) => ({ ...comp, order: index })),
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentPageId');
    }
    set({
      components: [],
      selectedComponentId: null,
      theme: defaultTheme,
      isEditing: false,
      currentPageId: null,
      pageName: 'Untitled Page',
    });
  },

  loadPage: (page) => {
    // Persist currentPageId to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentPageId', page.id);
    }
    set({
      components: page.components,
      theme: page.theme,
      currentPageId: page.id,
      pageName: page.name,
      selectedComponentId: null,
    });
  },

  setPageName: (name) => {
    set({ pageName: name });
    get().triggerAutoSave();
  },

  setCurrentPageId: (id) => set({ currentPageId: id }),

  triggerAutoSave: () => {
    const state = get();

    // Clear existing timeout
    if (state.autoSaveTimeout) {
      clearTimeout(state.autoSaveTimeout);
    }

    // Set new timeout for auto-save (2 seconds after last change)
    const timeout = setTimeout(async () => {
      set({ isSaving: true });
      const { components, theme, pageName, currentPageId } = get();

      try {
        const pageData = { name: pageName, components, theme };

        if (currentPageId) {
          try {
            await updatePage(currentPageId, pageData);
            console.log('Auto-saved successfully');
          } catch (updateError: any) {
            console.error('Failed to update page, trying to create new:', updateError);
            // If update fails, the page might not exist - try creating it
            const savedPage = await savePage(pageData);
            set({ currentPageId: savedPage.id });
            console.log('Page created and auto-saved');
          }
        } else {
          const savedPage = await savePage(pageData);
          set({ currentPageId: savedPage.id });
          console.log('Page created and auto-saved');
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        set({ isSaving: false });
      }
    }, 2000);

    set({ autoSaveTimeout: timeout });
  },
}));

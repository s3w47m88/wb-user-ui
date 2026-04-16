export type ElementPosition = {
  x: number;
  y: number;
};

export type LayoutEditorApi = {
  editable: boolean;
  selectedKey: string | null;
  isComponentSelected: boolean;
  getLayout: (elementKey: string) => ElementPosition;
  selectKey: (elementKey: string | null) => void;
  commitLayout: (elementKey: string, position: ElementPosition) => void;
  save: () => void;
};

type CreateLayoutEditorInput = {
  props: Record<string, unknown>;
  editable: boolean;
  selectedKey: string | null;
  isComponentSelected: boolean;
  onSelect: (elementKey: string | null) => void;
  onCommit: (elementKey: string, position: ElementPosition) => void;
  onSave: () => void;
};

export const SNAP_GRID_SIZE = 16;

export const snapPosition = (value: number) =>
  Math.round(value / SNAP_GRID_SIZE) * SNAP_GRID_SIZE;

export const getElementLayouts = (
  props: Record<string, unknown>,
): Record<string, Partial<ElementPosition>> => {
  const value = props.elementLayouts;
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, Partial<ElementPosition>>)
    : {};
};

export const getElementLayout = (
  props: Record<string, unknown>,
  elementKey: string,
): ElementPosition => {
  const layout = getElementLayouts(props)[elementKey];

  return {
    x: typeof layout?.x === "number" ? layout.x : 0,
    y: typeof layout?.y === "number" ? layout.y : 0,
  };
};

export function createLayoutEditor({
  props,
  editable,
  selectedKey,
  isComponentSelected,
  onSelect,
  onCommit,
  onSave,
}: CreateLayoutEditorInput): LayoutEditorApi {
  const getLayoutForElement = (elementKey: string) =>
    getElementLayout(props, elementKey);

  if (!editable) {
    return {
      editable: false,
      selectedKey: null,
      isComponentSelected: false,
      getLayout: getLayoutForElement,
      selectKey: () => undefined,
      commitLayout: () => undefined,
      save: () => undefined,
    };
  }

  return {
    editable: true,
    selectedKey,
    isComponentSelected,
    getLayout: getLayoutForElement,
    selectKey: onSelect,
    commitLayout: (elementKey, position) =>
      onCommit(elementKey, {
        x: snapPosition(position.x),
        y: snapPosition(position.y),
      }),
    save: onSave,
  };
}

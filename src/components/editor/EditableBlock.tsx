"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ComponentData, ThemeConfig } from "@/lib/supabase-content";
import { useEditorStore } from "@/store/editor-store";
import {
  createLayoutEditor,
  getElementLayouts,
  LayoutEditorApi,
  ElementPosition,
  SNAP_GRID_SIZE,
  snapPosition,
} from "@/lib/element-layouts";
import {
  GripVertical,
  Trash2,
  Image as ImageIcon,
  Move,
  AlignLeft,
  AlignCenterHorizontal,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
} from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { FloatingTextToolbar } from "./FloatingTextToolbar";
import { getBlockComponent } from "@/lib/block-registry";
import { GridCell } from "@/components/blocks/GridBlock";

type EditableBlockProps = {
  component: ComponentData;
  disabled?: boolean;
};

type GalleryImage = {
  url: string;
  alt?: string;
};

type NewsArticle = {
  headline?: string;
  date?: string;
  excerpt?: string;
  link?: string;
};

type FooterLink = {
  title?: string;
  url?: string;
};

type SocialLink = {
  platform?: string;
  url?: string;
  icon?: string;
};

type AlignmentCommand =
  | "left"
  | "center"
  | "right"
  | "top"
  | "middle"
  | "bottom";

const ALIGNMENT_BUTTONS: Array<{
  command: AlignmentCommand;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = [
  { command: "left", label: "Align left", icon: AlignLeft },
  { command: "center", label: "Align center", icon: AlignCenterHorizontal },
  { command: "right", label: "Align right", icon: AlignRight },
  { command: "top", label: "Align top", icon: AlignStartVertical },
  { command: "middle", label: "Align middle", icon: AlignCenterVertical },
  { command: "bottom", label: "Align bottom", icon: AlignEndVertical },
];

const SectionSnapGrid: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      <div
        className="absolute inset-0 opacity-40 transition-opacity duration-200"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)
          `,
          backgroundSize: `${SNAP_GRID_SIZE}px ${SNAP_GRID_SIZE}px`,
          maskImage:
            "radial-gradient(circle at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, transparent 88%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 55%, transparent 88%)",
        }}
      />
    </div>
  );
};

type EditableElementFrameProps = {
  elementKey: string;
  layoutEditor?: LayoutEditorApi;
  className?: string;
  children: React.ReactNode;
};

const EditableElementFrame: React.FC<EditableElementFrameProps> = ({
  elementKey,
  layoutEditor,
  className = "",
  children,
}) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const baseLayout = layoutEditor?.getLayout(elementKey);
  const baseX = baseLayout?.x ?? 0;
  const baseY = baseLayout?.y ?? 0;
  const [draftLayout, setDraftLayout] = useState<ElementPosition | null>(null);
  const draftLayoutRef = useRef<ElementPosition | null>(null);
  const [dragStart, setDragStart] = useState<{
    pointerX: number;
    pointerY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const isSelected = Boolean(
    layoutEditor?.editable &&
    layoutEditor.isComponentSelected &&
    layoutEditor.selectedKey === elementKey,
  );
  const liveLayout = draftLayout ?? { x: baseX, y: baseY };

  useEffect(() => {
    if (!dragStart || !layoutEditor) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const nextLayout = {
        x: snapPosition(dragStart.startX + event.clientX - dragStart.pointerX),
        y: snapPosition(dragStart.startY + event.clientY - dragStart.pointerY),
      };
      draftLayoutRef.current = nextLayout;
      setDraftLayout(nextLayout);
    };

    const handlePointerUp = () => {
      const finalLayout = draftLayoutRef.current ?? { x: baseX, y: baseY };
      layoutEditor.commitLayout(elementKey, finalLayout);
      layoutEditor.save();
      draftLayoutRef.current = null;
      setDragStart(null);
      setDraftLayout(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [baseX, baseY, dragStart, elementKey, layoutEditor]);

  const handleSelect = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    layoutEditor?.selectKey(elementKey);
  };

  const handleAlign = (
    command: AlignmentCommand,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!layoutEditor || !frameRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const parent = frameRef.current.offsetParent;
    if (!(parent instanceof HTMLElement)) {
      return;
    }

    const frameRect = frameRef.current.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const nextLayout = { x: baseX, y: baseY };

    if (command === "left") {
      nextLayout.x = baseX + (parentRect.left - frameRect.left);
    }

    if (command === "center") {
      nextLayout.x =
        baseX +
        (parentRect.left +
          (parentRect.width - frameRect.width) / 2 -
          frameRect.left);
    }

    if (command === "right") {
      nextLayout.x =
        baseX + (parentRect.right - frameRect.width - frameRect.left);
    }

    if (command === "top") {
      nextLayout.y = baseY + (parentRect.top - frameRect.top);
    }

    if (command === "middle") {
      nextLayout.y =
        baseY +
        (parentRect.top +
          (parentRect.height - frameRect.height) / 2 -
          frameRect.top);
    }

    if (command === "bottom") {
      nextLayout.y =
        baseY + (parentRect.bottom - frameRect.height - frameRect.top);
    }

    draftLayoutRef.current = null;
    setDraftLayout(null);
    layoutEditor.commitLayout(elementKey, nextLayout);
    layoutEditor.save();
    layoutEditor.selectKey(elementKey);
  };

  const handleDragStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!layoutEditor) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    layoutEditor.selectKey(elementKey);
    setDragStart({
      pointerX: event.clientX,
      pointerY: event.clientY,
      startX: baseX,
      startY: baseY,
    });
  };

  return (
    <div
      ref={frameRef}
      className={`relative transition-transform duration-150 ${className} ${
        isSelected ? "z-20" : "z-10"
      }`}
      style={{
        transform: `translate(${liveLayout.x}px, ${liveLayout.y}px)`,
      }}
      onClick={handleSelect}
    >
      <div
        className={`relative ${
          isSelected
            ? "rounded-lg ring-2 ring-white/80 shadow-[0_0_0_1px_rgba(15,23,42,0.35)]"
            : ""
        }`}
      >
        {children}
      </div>

      {isSelected && layoutEditor?.editable && (
        <>
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/70 p-1 text-white shadow-lg backdrop-blur-sm">
            {ALIGNMENT_BUTTONS.map(({ command, label, icon: Icon }) => (
              <button
                key={command}
                type="button"
                onClick={(event) => handleAlign(command, event)}
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/15"
                title={label}
              >
                <Icon size={12} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onPointerDown={handleDragStart}
            className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/85"
            title="Drag with grid snapping"
          >
            <Move size={12} />
            Drag
          </button>
        </>
      )}
    </div>
  );
};

export const EditableBlock: React.FC<EditableBlockProps> = ({
  component,
  disabled = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: component.id,
    disabled,
  });

  const {
    updateComponent,
    removeComponent,
    theme,
    saveNow,
    selectComponent,
    selectedComponentId,
  } = useEditorStore();
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showTextToolbar, setShowTextToolbar] = useState(false);
  const [currentImageKey, setCurrentImageKey] = useState<string | null>(null);
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(
    null,
  );
  const isComponentSelected = selectedComponentId === component.id;
  const visibleSelectedElementKey = isComponentSelected
    ? selectedElementKey
    : null;
  const currentImageUrl =
    currentImageKey && typeof component.props[currentImageKey] === "string"
      ? component.props[currentImageKey]
      : undefined;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTextEdit = (key: string, value: string) => {
    updateComponent(component.id, { [key]: value });
  };

  const handleImageEdit = (key: string) => {
    setCurrentImageKey(key);
    setShowImageUploader(true);
  };

  const handleImageSelected = (url: string) => {
    if (currentImageKey) {
      updateComponent(component.id, { [currentImageKey]: url });
    }
  };

  const handleTextSelect = () => {
    setShowTextToolbar(true);
  };

  const handleTextFocus = (e: React.FocusEvent) => {
    e.stopPropagation();
    setShowTextToolbar(true);
  };

  const handleTextBlur = (e: React.FocusEvent) => {
    // Don't hide if we're clicking on the toolbar
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest(".floating-text-toolbar")) {
      return;
    }

    saveNow();

    // Delay hiding to allow toolbar interactions
    setTimeout(() => {
      setShowTextToolbar(false);
    }, 150);
  };

  const commitElementLayout = (
    elementKey: string,
    position: ElementPosition,
  ) => {
    const elementLayouts = getElementLayouts(component.props);
    updateComponent(component.id, {
      elementLayouts: {
        ...elementLayouts,
        [elementKey]: {
          x: snapPosition(position.x),
          y: snapPosition(position.y),
        },
      },
    });
  };

  const layoutEditor: LayoutEditorApi = createLayoutEditor({
    props: component.props,
    editable: !disabled,
    selectedKey: visibleSelectedElementKey,
    isComponentSelected,
    onSelect: (elementKey) => {
      selectComponent(component.id);
      setSelectedElementKey(elementKey);
    },
    onCommit: commitElementLayout,
    onSave: saveNow,
  });

  if (disabled) {
    return (
      <div ref={setNodeRef}>
        {renderComponent(
          component,
          false,
          handleTextEdit,
          handleImageEdit,
          theme,
          updateComponent,
          undefined,
          undefined,
          undefined,
          layoutEditor,
        )}
        <ImageUploader
          isOpen={showImageUploader}
          onClose={() => setShowImageUploader(false)}
          onImageSelected={handleImageSelected}
          currentImageUrl={currentImageUrl}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      onClick={() => {
        selectComponent(component.id);
        setSelectedElementKey(null);
      }}
    >
      {/* Drag handle and controls - Always visible on left edge */}
      <div className="absolute left-2 top-4 flex flex-col gap-2 z-50 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 border border-gray-200">
        <button
          {...attributes}
          {...listeners}
          className="p-2 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing transition-colors"
          title="Drag to reorder"
        >
          <GripVertical size={20} className="text-gray-600" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Delete this component?")) {
              removeComponent(component.id);
            }
          }}
          className="p-2 hover:bg-red-50 rounded hover:text-red-600 transition-colors"
          title="Delete"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Component content with inline editing */}
      <div className="relative">
        {renderComponent(
          component,
          true,
          handleTextEdit,
          handleImageEdit,
          theme,
          updateComponent,
          handleTextFocus,
          handleTextSelect,
          handleTextBlur,
          layoutEditor,
        )}
      </div>

      {/* Image Uploader Modal */}
      <ImageUploader
        isOpen={showImageUploader}
        onClose={() => setShowImageUploader(false)}
        onImageSelected={handleImageSelected}
        currentImageUrl={currentImageUrl}
      />

      {/* Floating Text Toolbar */}
      <FloatingTextToolbar
        isVisible={showTextToolbar}
        onClose={() => setShowTextToolbar(false)}
      />
    </div>
  );
};

function renderComponent(
  component: ComponentData,
  editable: boolean,
  onTextEdit: (key: string, value: string) => void,
  onImageEdit: (key: string) => void,
  theme: ThemeConfig,
  updateComponent?: (id: string, props: Record<string, unknown>) => void,
  onTextFocus?: (e: React.FocusEvent) => void,
  onTextSelect?: () => void,
  onTextBlur?: (e: React.FocusEvent) => void,
  layoutEditor?: LayoutEditorApi,
) {
  const { type, props } = component;
  const headingFontFamily = theme?.fonts?.heading || "inherit";
  const bodyFontFamily = theme?.fonts?.body || "inherit";
  const getStringProp = (key: string, fallback = "") => {
    const value = props[key];
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number") {
      return String(value);
    }
    return fallback;
  };
  const getNumberProp = (key: string, fallback = 0) =>
    typeof props[key] === "number" ? props[key] : fallback;
  const getBooleanProp = (key: string) => props[key] === true;

  // Hero Block
  if (type === "hero") {
    const gradientFrom = theme.colors.primary || "#3b82f6";
    const gradientTo = theme.colors.secondary || "#8b5cf6";

    return (
      <div
        className="relative flex items-center justify-center min-h-[500px] text-white overflow-hidden"
        onClick={() => editable && layoutEditor?.selectKey(null)}
        style={{
          backgroundImage: getStringProp("backgroundImage")
            ? `url(${getStringProp("backgroundImage")})`
            : `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: `linear-gradient(to right, ${gradientFrom}33, ${gradientTo}33)`,
          }}
        />
        <SectionSnapGrid
          visible={Boolean(
            layoutEditor?.isComponentSelected && layoutEditor.selectedKey,
          )}
        />

        <div className="relative z-10 text-center max-w-4xl px-6">
          <EditableElementFrame
            elementKey="hero-title"
            layoutEditor={layoutEditor}
            className="mx-auto mb-4 w-fit max-w-full"
          >
            <h1
              className="text-5xl md:text-6xl font-bold animate-slide-up"
              contentEditable={editable}
              suppressContentEditableWarning
              onFocus={(e) => editable && onTextFocus?.(e)}
              onMouseUp={() => editable && onTextSelect?.()}
              onBlur={(e) => {
                if (editable) {
                  onTextEdit("title", e.currentTarget.textContent || "");
                  onTextBlur?.(e);
                }
              }}
              style={{
                outline: editable ? "2px dashed rgba(255,255,255,0.3)" : "none",
                cursor: editable ? "text" : "default",
                fontFamily: headingFontFamily,
              }}
            >
              {getStringProp("title")}
            </h1>
          </EditableElementFrame>
          <EditableElementFrame
            elementKey="hero-subtitle"
            layoutEditor={layoutEditor}
            className="mx-auto mb-8 w-fit max-w-full"
          >
            <p
              className="text-xl md:text-2xl opacity-90 animate-slide-up animation-delay-200"
              contentEditable={editable}
              suppressContentEditableWarning
              onFocus={(e) => editable && onTextFocus?.(e)}
              onMouseUp={() => editable && onTextSelect?.()}
              onBlur={(e) => {
                if (editable) {
                  onTextEdit("subtitle", e.currentTarget.textContent || "");
                  onTextBlur?.(e);
                }
              }}
              style={{
                outline: editable ? "2px dashed rgba(255,255,255,0.3)" : "none",
                cursor: editable ? "text" : "default",
                fontFamily: bodyFontFamily,
              }}
            >
              {getStringProp("subtitle")}
            </p>
          </EditableElementFrame>
          <EditableElementFrame
            elementKey="hero-cta"
            layoutEditor={layoutEditor}
            className="mx-auto w-fit"
          >
            <a
              href={getStringProp("ctaLink", "#")}
              className="inline-block px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-slide-up animation-delay-400"
              contentEditable={editable}
              suppressContentEditableWarning
              onClick={(e) => editable && e.preventDefault()}
              onFocus={(e) => editable && onTextFocus?.(e)}
              onMouseUp={() => editable && onTextSelect?.()}
              onBlur={(e) => {
                if (editable) {
                  onTextEdit("ctaText", e.currentTarget.textContent || "");
                  onTextBlur?.(e);
                }
              }}
              style={{
                outline: editable ? "2px dashed rgba(255,255,255,0.3)" : "none",
                cursor: editable ? "text" : "default",
                backgroundColor: theme.colors.background || "#ffffff",
                color: theme.colors.primary || "#3b82f6",
                fontFamily: bodyFontFamily,
              }}
            >
              {getStringProp("ctaText")}
            </a>
          </EditableElementFrame>
          {editable && (
            <button
              onClick={() => onImageEdit("backgroundImage")}
              className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-colors"
              title="Change background image"
            >
              <ImageIcon size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // CTA Block
  if (type === "cta") {
    const bgColor =
      theme.colors.primary || getStringProp("backgroundColor", "#3b82f6");

    return (
      <div
        className="py-16 px-6 text-center relative overflow-hidden"
        onClick={() => editable && layoutEditor?.selectKey(null)}
        style={{ backgroundColor: bgColor }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-float animation-delay-1000" />
        </div>
        <SectionSnapGrid
          visible={Boolean(
            layoutEditor?.isComponentSelected && layoutEditor.selectedKey,
          )}
        />

        <div className="max-w-3xl mx-auto relative z-10">
          <EditableElementFrame
            elementKey="cta-heading"
            layoutEditor={layoutEditor}
            className="mx-auto mb-4 w-fit max-w-full"
          >
            <h2
              className="text-4xl font-bold text-white animate-fade-in"
              contentEditable={editable}
              suppressContentEditableWarning
              onFocus={(e) => editable && onTextFocus?.(e)}
              onMouseUp={() => editable && onTextSelect?.()}
              onBlur={(e) => {
                if (editable) {
                  onTextEdit("heading", e.currentTarget.textContent || "");
                  onTextBlur?.(e);
                }
              }}
              style={{
                outline: editable ? "2px dashed rgba(255,255,255,0.3)" : "none",
                cursor: editable ? "text" : "default",
                fontFamily: headingFontFamily,
              }}
            >
              {getStringProp("heading")}
            </h2>
          </EditableElementFrame>
          <EditableElementFrame
            elementKey="cta-description"
            layoutEditor={layoutEditor}
            className="mx-auto mb-8 w-fit max-w-full"
          >
            <p
              className="text-xl text-white/90 animate-fade-in animation-delay-200"
              contentEditable={editable}
              suppressContentEditableWarning
              onFocus={(e) => editable && onTextFocus?.(e)}
              onMouseUp={() => editable && onTextSelect?.()}
              onBlur={(e) => {
                if (editable) {
                  onTextEdit("description", e.currentTarget.textContent || "");
                  onTextBlur?.(e);
                }
              }}
              style={{
                outline: editable ? "2px dashed rgba(255,255,255,0.3)" : "none",
                cursor: editable ? "text" : "default",
                fontFamily: bodyFontFamily,
              }}
            >
              {getStringProp("description")}
            </p>
          </EditableElementFrame>
          <EditableElementFrame
            elementKey="cta-button"
            layoutEditor={layoutEditor}
            className="mx-auto w-fit"
          >
            <a
              href={getStringProp("buttonLink", "#")}
              className="inline-block px-8 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in animation-delay-400"
              contentEditable={editable}
              suppressContentEditableWarning
              onClick={(e) => editable && e.preventDefault()}
              onFocus={(e) => editable && onTextFocus?.(e)}
              onMouseUp={() => editable && onTextSelect?.()}
              onBlur={(e) => {
                if (editable) {
                  onTextEdit("buttonText", e.currentTarget.textContent || "");
                  onTextBlur?.(e);
                }
              }}
              style={{
                outline: editable ? "2px dashed rgba(255,255,255,0.3)" : "none",
                cursor: editable ? "text" : "default",
                backgroundColor: theme.colors.background || "#ffffff",
                color: theme.colors.primary || "#3b82f6",
                fontFamily: bodyFontFamily,
              }}
            >
              {getStringProp("buttonText")}
            </a>
          </EditableElementFrame>
        </div>
      </div>
    );
  }

  // Gallery Block
  if (type === "gallery") {
    const images = Array.isArray(props.images)
      ? (props.images as GalleryImage[])
      : [];

    return (
      <div
        className="relative py-16 px-6"
        onClick={() => editable && layoutEditor?.selectKey(null)}
        style={{ backgroundColor: theme.colors.background || "#f9fafb" }}
      >
        <SectionSnapGrid
          visible={Boolean(
            layoutEditor?.isComponentSelected && layoutEditor.selectedKey,
          )}
        />
        <div className="max-w-7xl mx-auto">
          <EditableElementFrame
            elementKey="gallery-title"
            layoutEditor={layoutEditor}
            className="mx-auto mb-12 w-fit max-w-full"
          >
            <h2
              className="text-4xl font-bold text-center animate-fade-in"
              contentEditable={editable}
              suppressContentEditableWarning
              onFocus={(e) => editable && onTextFocus?.(e)}
              onMouseUp={() => editable && onTextSelect?.()}
              onBlur={(e) => {
                if (editable) {
                  onTextEdit("title", e.currentTarget.textContent || "");
                  onTextBlur?.(e);
                }
              }}
              style={{
                outline: editable
                  ? "2px dashed rgba(59, 130, 246, 0.5)"
                  : "none",
                cursor: editable ? "text" : "default",
                color: theme.colors.text || "#1f2937",
                fontFamily: headingFontFamily,
              }}
            >
              {getStringProp("title")}
            </h2>
          </EditableElementFrame>
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${getNumberProp("columns", 3)}, minmax(0, 1fr))`,
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg bg-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 animate-fade-in group relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-2 transition-all duration-500"
                />
                {editable && (
                  <button
                    onClick={() => onImageEdit("images")}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <ImageIcon size={32} className="text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Text Block
  if (type === "text") {
    const alignmentClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    const fontSizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    };

    return (
      <div
        className="relative py-8 px-6"
        onClick={() => editable && layoutEditor?.selectKey(null)}
        style={{ backgroundColor: theme.colors.background || "#ffffff" }}
      >
        <SectionSnapGrid
          visible={Boolean(
            layoutEditor?.isComponentSelected && layoutEditor.selectedKey,
          )}
        />
        <div className="max-w-4xl mx-auto animate-fade-in">
          <EditableElementFrame
            elementKey="text-content"
            layoutEditor={layoutEditor}
            className="block"
          >
            <div
              className={`prose prose-lg ${alignmentClasses[getStringProp("alignment") as keyof typeof alignmentClasses] || "text-left"} ${fontSizeClasses[getStringProp("fontSize") as keyof typeof fontSizeClasses] || "text-base"}`}
              contentEditable={editable}
              suppressContentEditableWarning
              onFocus={(e) => editable && onTextFocus?.(e)}
              onMouseUp={() => editable && onTextSelect?.()}
              onBlur={(e) => {
                if (editable) {
                  onTextEdit("content", e.currentTarget.innerHTML);
                  onTextBlur?.(e);
                }
              }}
              dangerouslySetInnerHTML={{ __html: getStringProp("content") }}
              style={{
                outline: editable
                  ? "2px dashed rgba(59, 130, 246, 0.5)"
                  : "none",
                cursor: editable ? "text" : "default",
                color: theme.colors.text || "#1f2937",
                fontFamily: bodyFontFamily,
              }}
            />
          </EditableElementFrame>
        </div>
      </div>
    );
  }

  // About Block
  if (type === "about") {
    return (
      <div
        className="relative py-16 px-6 bg-white"
        onClick={() => editable && layoutEditor?.selectKey(null)}
      >
        <SectionSnapGrid
          visible={Boolean(
            layoutEditor?.isComponentSelected && layoutEditor.selectedKey,
          )}
        />
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <EditableElementFrame
              elementKey="about-image"
              layoutEditor={layoutEditor}
              className="block"
            >
              <div className="relative">
                <img
                  src={getStringProp("imageUrl")}
                  alt={getStringProp("candidateName")}
                  className="w-full rounded-lg shadow-xl"
                />
                {editable && (
                  <button
                    onClick={() => onImageEdit("imageUrl")}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors shadow-lg"
                    title="Change photo"
                  >
                    <ImageIcon size={20} />
                  </button>
                )}
              </div>
            </EditableElementFrame>

            <div>
              <div className="flex items-center gap-3 mb-4">
                {getBooleanProp("flagEmoji") && (
                  <span className="text-4xl">🇺🇸</span>
                )}
                <div className="flex-1">
                  <EditableElementFrame
                    elementKey="about-name"
                    layoutEditor={layoutEditor}
                    className="w-fit max-w-full"
                  >
                    <h2
                      className="text-4xl font-bold"
                      contentEditable={editable}
                      suppressContentEditableWarning
                      onFocus={(e) => editable && onTextFocus?.(e)}
                      onMouseUp={() => editable && onTextSelect?.()}
                      onBlur={(e) => {
                        if (editable) {
                          onTextEdit(
                            "candidateName",
                            e.currentTarget.textContent || "",
                          );
                          onTextBlur?.(e);
                        }
                      }}
                      style={{
                        outline: editable
                          ? "2px dashed rgba(59, 130, 246, 0.5)"
                          : "none",
                        cursor: editable ? "text" : "default",
                        fontFamily: headingFontFamily,
                      }}
                    >
                      {getStringProp("candidateName")}
                    </h2>
                  </EditableElementFrame>
                  <EditableElementFrame
                    elementKey="about-title"
                    layoutEditor={layoutEditor}
                    className="mt-1 w-fit max-w-full"
                  >
                    <p
                      className="text-xl text-gray-600"
                      contentEditable={editable}
                      suppressContentEditableWarning
                      onFocus={(e) => editable && onTextFocus?.(e)}
                      onMouseUp={() => editable && onTextSelect?.()}
                      onBlur={(e) => {
                        if (editable) {
                          onTextEdit(
                            "candidateTitle",
                            e.currentTarget.textContent || "",
                          );
                          onTextBlur?.(e);
                        }
                      }}
                      style={{
                        outline: editable
                          ? "2px dashed rgba(59, 130, 246, 0.5)"
                          : "none",
                        cursor: editable ? "text" : "default",
                        fontFamily: bodyFontFamily,
                      }}
                    >
                      {getStringProp("candidateTitle")}
                    </p>
                  </EditableElementFrame>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mt-6">
                <EditableElementFrame
                  elementKey="about-bio"
                  layoutEditor={layoutEditor}
                  className="block"
                >
                  <p
                    className="text-gray-700 leading-relaxed whitespace-pre-line"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onFocus={(e) => editable && onTextFocus?.(e)}
                    onMouseUp={() => editable && onTextSelect?.()}
                    onBlur={(e) => {
                      if (editable) {
                        onTextEdit("bio", e.currentTarget.textContent || "");
                        onTextBlur?.(e);
                      }
                    }}
                    style={{
                      outline: editable
                        ? "2px dashed rgba(59, 130, 246, 0.5)"
                        : "none",
                      cursor: editable ? "text" : "default",
                      fontFamily: bodyFontFamily,
                    }}
                  >
                    {getStringProp("bio")}
                  </p>
                </EditableElementFrame>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // News Block
  if (type === "news") {
    const articles = Array.isArray(props.articles)
      ? (props.articles as NewsArticle[])
      : [];

    return (
      <div className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-4xl font-bold text-center mb-12"
            contentEditable={editable}
            suppressContentEditableWarning
            onFocus={(e) => editable && onTextFocus?.(e)}
            onMouseUp={() => editable && onTextSelect?.()}
            onBlur={(e) => {
              if (editable) {
                onTextEdit("title", e.currentTarget.textContent || "");
                onTextBlur?.(e);
              }
            }}
            style={{
              outline: editable ? "2px dashed rgba(59, 130, 246, 0.5)" : "none",
              cursor: editable ? "text" : "default",
              fontFamily: headingFontFamily,
            }}
          >
            {getStringProp("title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <p
                    className="text-sm text-gray-500 mb-2"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onFocus={(e) => editable && onTextFocus?.(e)}
                    onMouseUp={() => editable && onTextSelect?.()}
                    onBlur={(e) => {
                      if (editable) {
                        const updatedArticles = [...articles];
                        updatedArticles[index] = {
                          ...updatedArticles[index],
                          date: e.currentTarget.textContent || "",
                        };
                        updateComponent?.(component.id, {
                          articles: updatedArticles,
                        });
                        onTextBlur?.(e);
                      }
                    }}
                    style={{
                      outline: editable
                        ? "2px dashed rgba(59, 130, 246, 0.5)"
                        : "none",
                      cursor: editable ? "text" : "default",
                      fontFamily: bodyFontFamily,
                    }}
                  >
                    {article.date}
                  </p>
                  <h3
                    className="text-xl font-bold mb-3"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onFocus={(e) => editable && onTextFocus?.(e)}
                    onMouseUp={() => editable && onTextSelect?.()}
                    onBlur={(e) => {
                      if (editable) {
                        const updatedArticles = [...articles];
                        updatedArticles[index] = {
                          ...updatedArticles[index],
                          headline: e.currentTarget.textContent || "",
                        };
                        updateComponent?.(component.id, {
                          articles: updatedArticles,
                        });
                        onTextBlur?.(e);
                      }
                    }}
                    style={{
                      outline: editable
                        ? "2px dashed rgba(59, 130, 246, 0.5)"
                        : "none",
                      cursor: editable ? "text" : "default",
                      fontFamily: headingFontFamily,
                    }}
                  >
                    {article.headline}
                  </h3>
                  <p
                    className="text-gray-600 mb-4"
                    contentEditable={editable}
                    suppressContentEditableWarning
                    onFocus={(e) => editable && onTextFocus?.(e)}
                    onMouseUp={() => editable && onTextSelect?.()}
                    onBlur={(e) => {
                      if (editable) {
                        const updatedArticles = [...articles];
                        updatedArticles[index] = {
                          ...updatedArticles[index],
                          excerpt: e.currentTarget.textContent || "",
                        };
                        updateComponent?.(component.id, {
                          articles: updatedArticles,
                        });
                        onTextBlur?.(e);
                      }
                    }}
                    style={{
                      outline: editable
                        ? "2px dashed rgba(59, 130, 246, 0.5)"
                        : "none",
                      cursor: editable ? "text" : "default",
                      fontFamily: bodyFontFamily,
                    }}
                  >
                    {article.excerpt}
                  </p>
                  <a
                    href={article.link}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Footer Block
  if (type === "footer") {
    const links = Array.isArray(props.links)
      ? (props.links as FooterLink[])
      : [];
    const socialLinks = Array.isArray(props.socialLinks)
      ? (props.socialLinks as SocialLink[])
      : [];

    return (
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3
                className="text-2xl font-bold mb-2"
                contentEditable={editable}
                suppressContentEditableWarning
                onFocus={(e) => editable && onTextFocus?.(e)}
                onMouseUp={() => editable && onTextSelect?.()}
                onBlur={(e) => {
                  if (editable) {
                    onTextEdit(
                      "companyName",
                      e.currentTarget.textContent || "",
                    );
                    onTextBlur?.(e);
                  }
                }}
                style={{
                  outline: editable
                    ? "2px dashed rgba(255, 255, 255, 0.3)"
                    : "none",
                  cursor: editable ? "text" : "default",
                  fontFamily: headingFontFamily,
                }}
              >
                {getStringProp("companyName")}
              </h3>
              <p
                className="text-gray-400"
                contentEditable={editable}
                suppressContentEditableWarning
                onFocus={(e) => editable && onTextFocus?.(e)}
                onMouseUp={() => editable && onTextSelect?.()}
                onBlur={(e) => {
                  if (editable) {
                    onTextEdit("tagline", e.currentTarget.textContent || "");
                    onTextBlur?.(e);
                  }
                }}
                style={{
                  outline: editable
                    ? "2px dashed rgba(255, 255, 255, 0.3)"
                    : "none",
                  cursor: editable ? "text" : "default",
                  fontFamily: bodyFontFamily,
                }}
              >
                {getStringProp("tagline")}
              </p>
            </div>

            {/* Links */}
            <div>
              <h4
                className="font-semibold mb-4"
                style={{ fontFamily: headingFontFamily }}
              >
                Quick Links
              </h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      className="text-gray-400 hover:text-white transition-colors"
                      contentEditable={editable}
                      suppressContentEditableWarning
                      onFocus={(e) => editable && onTextFocus?.(e)}
                      onMouseUp={() => editable && onTextSelect?.()}
                      onBlur={(e) => {
                        if (editable) {
                          const updatedLinks = [...links];
                          updatedLinks[index] = {
                            ...updatedLinks[index],
                            title: e.currentTarget.textContent || "",
                          };
                          updateComponent?.(component.id, {
                            links: updatedLinks,
                          });
                          onTextBlur?.(e);
                        }
                      }}
                      style={{
                        outline: editable
                          ? "2px dashed rgba(255, 255, 255, 0.3)"
                          : "none",
                        cursor: editable ? "text" : "default",
                        fontFamily: bodyFontFamily,
                      }}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4
                className="font-semibold mb-4"
                style={{ fontFamily: headingFontFamily }}
              >
                Follow Us
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="text-2xl hover:text-blue-400 transition-colors"
                    title={social.platform}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} {getStringProp("companyName")}. All
            rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  // Grid Block - needs special handling for editable callbacks
  if (type === "grid") {
    const GridComponent = getBlockComponent("grid");
    if (GridComponent) {
      return (
        <GridComponent
          {...props}
          editable={editable}
          onUpdateCells={(cells: GridCell[]) => {
            if (updateComponent) {
              updateComponent(component.id, { cells });
            }
          }}
          onUpdateGrid={(rows: number, columns: number) => {
            if (updateComponent) {
              updateComponent(component.id, { rows, columns });
            }
          }}
        />
      );
    }
  }

  // Use block registry for other component types
  const BlockComponent = getBlockComponent(type);
  if (BlockComponent) {
    return <BlockComponent {...props} />;
  }

  return (
    <div className="p-8 bg-red-50 border-2 border-red-300 rounded-lg text-red-700">
      Unknown component type: {type}
    </div>
  );
}

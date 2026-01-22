'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Type,
  Palette,
} from 'lucide-react';

type FloatingTextToolbarProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const FloatingTextToolbar: React.FC<FloatingTextToolbarProps> = ({
  isVisible,
  onClose,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [fontSize, setFontSize] = useState('16');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      // Delay positioning slightly to ensure DOM has updated
      setTimeout(() => updatePosition(), 10);
    }
  }, [isVisible]);

  const updatePosition = () => {
    const selection = window.getSelection();
    const activeElement = document.activeElement;

    if (selection && selection.rangeCount > 0 && selection.toString().length > 0) {
      // Position based on text selection
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setPosition({
        top: rect.top + window.scrollY - 70,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    } else if (activeElement && activeElement.getAttribute('contenteditable') === 'true') {
      // Position relative to the focused contenteditable element
      const rect = activeElement.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY - 70,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleFontSize = (size: string) => {
    setFontSize(size);
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = `${size}px`;
      range.surroundContents(span);
    }
  };

  const handleTextColor = (color: string) => {
    setTextColor(color);
    execCommand('foreColor', color);
  };

  const handleBgColor = (color: string) => {
    setBgColor(color);
    execCommand('backColor', color);
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={toolbarRef}
      className="floating-text-toolbar fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-2 flex items-center gap-1 animate-fade-in"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translateX(-50%)',
      }}
      onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
    >
      {/* Text Formatting */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <button
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => execCommand('underline')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </button>
        <button
          onClick={() => execCommand('strikeThrough')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>
      </div>

      {/* Font Size */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <Type size={16} className="text-gray-500" />
        <select
          value={fontSize}
          onChange={(e) => handleFontSize(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20">20px</option>
          <option value="24">24px</option>
          <option value="28">28px</option>
          <option value="32">32px</option>
          <option value="36">36px</option>
          <option value="48">48px</option>
        </select>
      </div>

      {/* Colors */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <div className="flex items-center gap-1">
          <Palette size={16} className="text-gray-500" />
          <input
            type="color"
            value={textColor}
            onChange={(e) => handleTextColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Text Color"
          />
          <input
            type="color"
            value={bgColor}
            onChange={(e) => handleBgColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-gray-300"
            title="Background Color"
          />
        </div>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <button
          onClick={() => execCommand('justifyLeft')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => execCommand('justifyCenter')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => execCommand('justifyRight')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <button
          onClick={() => execCommand('justifyFull')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Justify"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      {/* Link */}
      <div className="flex items-center gap-1">
        <button
          onClick={handleLink}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </button>
      </div>
    </div>
  );
};

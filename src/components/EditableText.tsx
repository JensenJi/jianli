import { useState, useRef, useEffect } from "react";
import { Edit3 } from "lucide-react";

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  isEditMode: boolean;
  isMultiline?: boolean;
  placeholder?: string;
  className?: string;
}

export default function EditableText({
  value,
  onChange,
  isEditMode,
  isMultiline = false,
  placeholder = "点击编辑...",
  className = "",
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current.tagName === "TEXTAREA") {
        inputRef.current.scrollTop = inputRef.current.scrollHeight;
      }
    }
  }, [isEditing]);

  const handleClick = () => {
    if (isEditMode) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isMultiline) {
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  if (!isEditMode) {
    return <span className={className}>{value || placeholder}</span>;
  }

  if (isEditing) {
    if (isMultiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-transparent border border-cyan-500/50 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${className}`}
          rows={4}
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full bg-transparent border border-cyan-500/50 rounded px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 ${className}`}
      />
    );
  }

  return (
    <span
      onClick={handleClick}
      className={`cursor-pointer hover:bg-cyan-950/30 px-1 rounded transition-colors inline-flex items-center gap-1 ${className}`}
    >
      {value || <span className="text-gray-500">{placeholder}</span>}
      <Edit3 className="w-3 h-3 text-cyan-400 opacity-50" />
    </span>
  );
}

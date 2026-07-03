import { useState } from "react";
import { Upload, X } from "lucide-react";

interface EditableImageProps {
  src: string;
  alt: string;
  placeholderIcon?: React.ReactNode;
  onChange: (src: string) => void;
  className?: string;
  isEditMode: boolean;
  aspect?: number;
}

export default function EditableImage({
  src,
  alt,
  placeholderIcon,
  onChange,
  className = "",
  isEditMode,
}: EditableImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isEditMode) {
    return src ? (
      <img src={src} alt={alt} className={className} />
    ) : (
      <div className={className}>{placeholderIcon}</div>
    );
  }

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">{placeholderIcon}</div>
      )}

      <div
        className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <label className="cursor-pointer flex items-center gap-2 text-white bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg transition-colors">
          <Upload className="w-4 h-4" />
          <span className="text-sm font-medium">更换图片</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {src && isHovered && (
        <button
          onClick={() => onChange("")}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

import { User, Plus, X } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import EditableImage from "./EditableImage";
import EditableText from "./EditableText";
import { useState } from "react";

export default function Hero() {
  const {
    avatarUrl,
    setAvatarUrl,
    heroTitle,
    setHeroTitle,
    heroSubtitle,
    setHeroSubtitle,
    heroTags,
    setHeroTags,
    isEditMode,
  } = useResumeStore();

  const [newTag, setNewTag] = useState("");

  const addTag = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    if (newTag.trim() && !heroTags.includes(newTag.trim())) {
      setHeroTags([...heroTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setHeroTags(heroTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <section className="w-full py-12 px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              <EditableText
                value={heroTitle}
                onChange={setHeroTitle}
                isEditMode={isEditMode}
                placeholder="输入你的标题..."
              />
            </h1>
            <p className="text-xl text-gray-400">
              <EditableText
                value={heroSubtitle}
                onChange={setHeroSubtitle}
                isEditMode={isEditMode}
                placeholder="输入你的副标题..."
                className="inline"
              />
            </p>
            <div className="flex flex-wrap gap-3">
              {heroTags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 bg-cyan-950/50 border border-cyan-700/50 text-cyan-300 rounded-full text-sm font-medium ${
                    isEditMode ? "group relative" : ""
                  }`}
                >
                  {tag}
                  {isEditMode && (
                    <button
                      onClick={() => removeTag(tag)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {isEditMode && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="添加标签..."
                    className="w-32 bg-gray-950/50 border border-gray-700 rounded-full px-3 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    onClick={addTag}
                    className="w-8 h-8 bg-cyan-600 hover:bg-cyan-700 rounded-full text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 overflow-hidden">
              <EditableImage
                src={avatarUrl}
                alt="头像"
                placeholderIcon={<User className="w-20 h-20 text-gray-900" />}
                onChange={setAvatarUrl}
                isEditMode={isEditMode}
                aspect={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

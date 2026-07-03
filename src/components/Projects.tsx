import { Code2, ShoppingCart, Smartphone, Plus, X } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import { useState } from "react";
import EditableText from "./EditableText";

export default function Projects() {
  const { projectItems, setProjectItems, isEditMode } = useResumeStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    icon: "Code2",
    title: "",
    description: "",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  const getIconForProject = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Code2,
      ShoppingCart,
      Smartphone,
    };
    const Icon = iconMap[iconName] || Code2;
    return <Icon className="w-12 h-12 text-cyan-400 mb-6" />;
  };

  const addProject = () => {
    if (newProject.title && newProject.description) {
      setProjectItems([...projectItems, newProject]);
      setNewProject({
        icon: "Code2",
        title: "",
        description: "",
        tags: [],
      });
      setNewTag("");
      setShowAddForm(false);
    }
  };

  const removeProject = (index: number) => {
    setProjectItems(projectItems.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: string, value: any) => {
    const newItems = [...projectItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setProjectItems(newItems);
  };

  const addTagToNewProject = () => {
    if (newTag.trim() && !newProject.tags.includes(newTag.trim())) {
      setNewProject({ ...newProject, tags: [...newProject.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTagFromNewProject = (tagToRemove: string) => {
    setNewProject({ ...newProject, tags: newProject.tags.filter(tag => tag !== tagToRemove) });
  };

  const removeTagFromProject = (index: number, tagToRemove: string) => {
    const newItems = [...projectItems];
    newItems[index] = {
      ...newItems[index],
      tags: newItems[index].tags.filter(tag => tag !== tagToRemove)
    };
    setProjectItems(newItems);
  };

  return (
    <section id="projects" className="w-full py-8 px-8 max-w-7xl mx-auto">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <div className="flex items-center justify-between mb-8 pt-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Code2 className="h-8 w-8 text-cyan-400" />
            特色项目
          </h2>
          {isEditMode && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加项目
            </button>
          )}
        </div>

        {isEditMode && showAddForm && (
          <div className="mb-8 bg-gray-950/50 border border-cyan-500/30 rounded-xl p-6">
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">图标</label>
              <select
                value={newProject.icon}
                onChange={(e) => setNewProject({ ...newProject, icon: e.target.value })}
                className="w-full bg-gray-950/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Code2">图表</option>
                <option value="ShoppingCart">购物车</option>
                <option value="Smartphone">手机</option>
              </select>
            </div>
            <input
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="项目名称"
              className="w-full mb-4 bg-gray-950/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="项目描述"
              rows={3}
              className="w-full mb-4 bg-gray-950/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">标签</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newProject.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-cyan-950/30 border border-cyan-700/30 text-cyan-300 rounded-md text-sm font-medium flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTagFromNewProject(tag)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTagToNewProject()}
                  placeholder="添加标签..."
                  className="flex-1 bg-gray-950/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={addTagToNewProject}
                  className="w-9 h-9 bg-cyan-600 hover:bg-cyan-700 rounded-md text-white flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addProject}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                确认添加
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {projectItems.map((project, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-gray-900/90 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10 ${
                isEditMode ? "group relative" : ""
              }`}
            >
              {isEditMode && (
                <button
                  onClick={() => removeProject(index)}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              {getIconForProject(project.icon)}
              {isEditMode ? (
                <input
                  value={project.title}
                  onChange={(e) => updateProject(index, "title", e.target.value)}
                  className="w-full mb-3 bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-2xl text-amber-100 font-bold focus:outline-none focus:border-cyan-500"
                />
              ) : (
                <h3 className="text-2xl font-bold text-amber-100 mb-3">{project.title}</h3>
              )}
              {isEditMode ? (
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  rows={4}
                  className="w-full mb-6 bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-gray-400 leading-relaxed resize-none focus:outline-none focus:border-cyan-500"
                />
              ) : (
                <p className="text-gray-400 mb-6 leading-relaxed">{project.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`px-3 py-1 bg-cyan-950/30 border border-cyan-700/30 text-cyan-300 rounded-md text-xs font-medium ${
                      isEditMode ? "group/tag relative" : ""
                    }`}
                  >
                    {tag}
                    {isEditMode && (
                      <button
                        onClick={() => removeTagFromProject(index, tag)}
                        className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover/tag:opacity-100 transition-opacity"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

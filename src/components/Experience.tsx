import { Briefcase, Plus, X } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import { useState } from "react";
import EditableText from "./EditableText";

export default function Experience() {
  const { experienceItems, setExperienceItems, isEditMode } = useResumeStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExperience, setNewExperience] = useState({
    period: "",
    company: "",
    position: "",
    description: "",
  });

  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      setExperienceItems([...experienceItems, newExperience]);
      setNewExperience({
        period: "",
        company: "",
        position: "",
        description: "",
      });
      setShowAddForm(false);
    }
  };

  const removeExperience = (index: number) => {
    setExperienceItems(experienceItems.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newItems = [...experienceItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setExperienceItems(newItems);
  };

  return (
    <section className="w-full py-8 px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              工作经历
            </span>
          </h2>
          {isEditMode && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加经历
            </button>
          )}
        </div>

        {isEditMode && showAddForm && (
          <div className="mb-8 bg-gray-950/50 border border-cyan-500/30 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                value={newExperience.period}
                onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                placeholder="时间段（如：2022-至今）"
                className="bg-gray-950/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
              <input
                value={newExperience.company}
                onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                placeholder="公司名称"
                className="bg-gray-950/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <input
              value={newExperience.position}
              onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              placeholder="职位"
              className="w-full mb-4 bg-gray-950/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <textarea
              value={newExperience.description}
              onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
              placeholder="工作描述"
              rows={3}
              className="w-full mb-4 bg-gray-950/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addExperience}
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

        <div className="space-y-8">
          {experienceItems.map((exp, index) => (
            <div key={index} className="relative pl-8 border-l-2 border-purple-500/30">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-cyan-400 rounded-full" />
              <div className={`bg-gray-950/30 rounded-lg p-6 ${isEditMode ? "group relative" : ""}`}>
                {isEditMode && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  {isEditMode ? (
                    <input
                      value={exp.period}
                      onChange={(e) => updateExperience(index, "period", e.target.value)}
                      className="bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-sm text-cyan-400 font-mono w-full md:w-auto focus:outline-none focus:border-cyan-500"
                    />
                  ) : (
                    <span className="text-sm font-mono text-cyan-400 mb-2 md:mb-0">{exp.period}</span>
                  )}
                  {isEditMode ? (
                    <input
                      value={exp.position}
                      onChange={(e) => updateExperience(index, "position", e.target.value)}
                      className="bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-lg text-amber-200 font-bold w-full md:w-auto focus:outline-none focus:border-cyan-500"
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-amber-200">{exp.position}</h3>
                  )}
                </div>
                {isEditMode ? (
                  <input
                    value={exp.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                    className="w-full mb-3 bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-lg text-gray-300 focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <h4 className="text-lg text-gray-300 mb-3">{exp.company}</h4>
                )}
                {isEditMode ? (
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                    rows={3}
                    className="w-full bg-gray-950/50 border border-gray-700 rounded px-2 py-1 text-gray-400 leading-relaxed resize-none focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <p className="text-gray-400 leading-relaxed">{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
